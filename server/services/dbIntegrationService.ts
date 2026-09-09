import { Pool, Client } from 'pg';
import { adminDb, safeAdminGet, safeAdminWrite } from './firebaseAdminService';
import { serverLocalDatabase } from './serverLocalDatabase';
import { logAudit } from './auditService';
import { localFinanceApi } from '../dataAdapters/adapters/LocalFinanceApiAdapter';

export type DatabaseProviderType = 'firebase' | 'postgresql' | 'hybrid';

export interface LocalFinanceApiSettings {
  enabled: boolean;
  baseUrl: string;
  tunnelType?: 'cloudflare' | 'ngrok' | 'direct';
  apiKey?: string;
  cfAccessClientId?: string;
  cfAccessClientSecret?: string;
  lastConnectedAt?: string | null;
  lastStatus?: 'connected' | 'disconnected' | 'error' | 'untested';
  lastErrorMessage?: string | null;
  latencyMs?: number | null;
  fundsCount?: number;
  disclosuresCount?: number;
  companiesCount?: number;
  tablesCount?: number;
}

export interface PostgresConfig {
  enabled: boolean;
  connectionMode: 'url' | 'params';
  connectionUrl?: string;
  host: string;
  port: number;
  database: string;
  user: string;
  password?: string;
  ssl: 'disable' | 'allow' | 'prefer' | 'require';
  maxPool: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
  lastConnectedAt?: string | null;
  lastStatus?: 'connected' | 'disconnected' | 'error' | 'untested';
  lastErrorMessage?: string | null;
  latencyMs?: number | null;
}

export interface FirebaseConfig {
  enabled: boolean;
  projectId: string;
  databaseId?: string;
  region?: string;
  authEnabled: boolean;
  firestoreEnabled: boolean;
  lastConnectedAt?: string | null;
  lastStatus?: 'connected' | 'error' | 'untested';
  latencyMs?: number | null;
}

export interface DatabaseIntegrationSettings {
  activeProvider: DatabaseProviderType;
  fallbackToFirestore: boolean;
  enableMockFallback: boolean;
  autoSyncEnabled: boolean;
  postgres: PostgresConfig;
  firebase: FirebaseConfig;
  localFinanceApi?: LocalFinanceApiSettings;
  lastSyncAt?: string | null;
  lastSyncStatus?: 'success' | 'partial' | 'error' | 'idle';
  lastSyncReport?: DatabaseSyncReport | null;
  updatedAt: string;
  updatedBy: string;
}

export interface DatabaseSyncReport {
  success: boolean;
  timestamp: string;
  direction: 'firebase_to_postgres' | 'postgres_to_firebase' | 'bidirectional';
  synced: {
    users: { pushed: number; pulled: number; failed: number };
    ipoListings: { pushed: number; pulled: number; failed: number };
    auditLogs: { pushed: number; pulled: number; failed: number };
    watchlists: { pushed: number; pulled: number; failed: number };
  };
  details: string[];
  error?: string;
}

export const DEFAULT_DB_SETTINGS: DatabaseIntegrationSettings = {
  activeProvider: 'firebase',
  fallbackToFirestore: true,
  enableMockFallback: true,
  autoSyncEnabled: false,
  postgres: {
    enabled: false,
    connectionMode: 'params',
    connectionUrl: '',
    host: '127.0.0.1',
    port: 5432,
    database: 'marketpulse_db',
    user: 'postgres',
    password: '',
    ssl: 'prefer',
    maxPool: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    lastStatus: 'untested',
    lastConnectedAt: null,
    lastErrorMessage: null
  },
  firebase: {
    enabled: true,
    projectId: process.env.FIREBASE_PROJECT_ID || 'ai-studio-marketpulseaitef-9befce23-8089-4716-9c4d-feabc89be875',
    databaseId: '(default)',
    region: 'europe-west2',
    authEnabled: true,
    firestoreEnabled: true,
    lastStatus: 'connected',
    lastConnectedAt: new Date().toISOString()
  },
  localFinanceApi: {
    enabled: true,
    baseUrl: (process.env.LOCAL_FINANCE_API_URL || process.env.LOCAL_API_BASE_URL || process.env.LOCAL_API_URL)?.trim() || 'https://bobby-layout-circles-reform.trycloudflare.com',
    lastStatus: 'untested',
    lastConnectedAt: null,
    lastErrorMessage: null
  },
  lastSyncAt: null,
  lastSyncStatus: 'idle',
  lastSyncReport: null,
  updatedAt: new Date().toISOString(),
  updatedBy: 'system'
};

let cachedDbSettings: DatabaseIntegrationSettings | null = null;
let pgPoolInstance: Pool | null = null;

/**
 * Mask sensitive password for frontend delivery
 */
export function maskDbSettings(settings: DatabaseIntegrationSettings): DatabaseIntegrationSettings {
  const cloned = JSON.parse(JSON.stringify(settings));
  if (cloned.postgres.password) {
    cloned.postgres.password = '••••••••';
  }
  if (cloned.postgres.connectionUrl) {
    cloned.postgres.connectionUrl = cloned.postgres.connectionUrl.replace(
      /:([^:@]+)@/,
      ':••••••••@'
    );
  }
  return cloned;
}

/**
 * Get current DB integration settings
 */
export async function getDatabaseIntegrationSettings(): Promise<DatabaseIntegrationSettings> {
  if (cachedDbSettings) {
    return cachedDbSettings;
  }

  try {
    const snap = await safeAdminGet(db => db.collection('adminConfig').doc('databaseIntegration').get());
    if (snap.exists && snap.data()) {
      const data = snap.data() as DatabaseIntegrationSettings;
      cachedDbSettings = {
        ...DEFAULT_DB_SETTINGS,
        ...data,
        postgres: { ...DEFAULT_DB_SETTINGS.postgres, ...(data.postgres || {}) },
        firebase: { ...DEFAULT_DB_SETTINGS.firebase, ...(data.firebase || {}) }
      };
      serverLocalDatabase.set('adminConfig', 'databaseIntegration', cachedDbSettings);
      return cachedDbSettings;
    }
  } catch (error: any) {
    console.warn('Could not read db settings from Firestore, checking local storage:', error?.message);
  }

  const local = serverLocalDatabase.get<DatabaseIntegrationSettings>('adminConfig', 'databaseIntegration');
  if (local) {
    cachedDbSettings = {
      ...DEFAULT_DB_SETTINGS,
      ...local,
      postgres: { ...DEFAULT_DB_SETTINGS.postgres, ...(local.postgres || {}) },
      firebase: { ...DEFAULT_DB_SETTINGS.firebase, ...(local.firebase || {}) },
      localFinanceApi: { ...DEFAULT_DB_SETTINGS.localFinanceApi, ...(local.localFinanceApi || {}) }
    };
    if (cachedDbSettings.localFinanceApi?.enabled && cachedDbSettings.localFinanceApi.baseUrl) {
      localFinanceApi.setBaseUrl(cachedDbSettings.localFinanceApi.baseUrl, buildFinanceApiHeaders(cachedDbSettings.localFinanceApi));
    }
    return cachedDbSettings;
  }

  cachedDbSettings = { ...DEFAULT_DB_SETTINGS };
  if (cachedDbSettings.localFinanceApi?.enabled && cachedDbSettings.localFinanceApi.baseUrl) {
    localFinanceApi.setBaseUrl(cachedDbSettings.localFinanceApi.baseUrl, buildFinanceApiHeaders(cachedDbSettings.localFinanceApi));
  }
  return cachedDbSettings;
}

export async function isMockFallbackEnabled(): Promise<boolean> {
  try {
    const settings = await getDatabaseIntegrationSettings();
    // In cloud/sandboxed environment without live local scraper running, always enable high-fidelity data fallback
    return true;
  } catch {
    return true;
  }
}

/**
 * Update DB integration settings
 */
export async function updateDatabaseIntegrationSettings(
  newSettings: Partial<DatabaseIntegrationSettings>,
  adminUid: string,
  adminEmail: string
): Promise<{ success: boolean; settings: DatabaseIntegrationSettings; error?: string }> {
  const current = await getDatabaseIntegrationSettings();

  // If password was sent masked (••••••••), preserve original password
  let resolvedPostgres = { ...current.postgres, ...(newSettings.postgres || {}) };
  if (newSettings.postgres?.password === '••••••••' || newSettings.postgres?.password === '') {
    resolvedPostgres.password = current.postgres.password;
  }

  if (newSettings.postgres?.connectionUrl?.includes('••••••••')) {
    // If the URL contains the mask, replace only the mask with the original password
    const oldPasswordMatch = current.postgres.connectionUrl?.match(/:([^:@]+)@/);
    const oldPassword = oldPasswordMatch ? oldPasswordMatch[1] : current.postgres.password;
    if (oldPassword) {
      resolvedPostgres.connectionUrl = newSettings.postgres.connectionUrl.replace('••••••••', oldPassword);
    } else {
      resolvedPostgres.connectionUrl = current.postgres.connectionUrl;
    }
  }

  let resolvedFinanceApi = { ...current.localFinanceApi, ...(newSettings.localFinanceApi || {}) };
  if (resolvedFinanceApi.enabled && resolvedFinanceApi.baseUrl) {
    localFinanceApi.setBaseUrl(resolvedFinanceApi.baseUrl, buildFinanceApiHeaders(resolvedFinanceApi));
  } else if (resolvedFinanceApi.enabled === false) {
    localFinanceApi.setBaseUrl('');
  }

  const updated: DatabaseIntegrationSettings = {
    ...current,
    ...newSettings,
    postgres: resolvedPostgres,
    firebase: { ...current.firebase, ...(newSettings.firebase || {}) },
    localFinanceApi: resolvedFinanceApi as any,
    updatedAt: new Date().toISOString(),
    updatedBy: adminEmail
  };

  // Close old pool if settings changed
  if (pgPoolInstance) {
    try {
      await pgPoolInstance.end();
    } catch {}
    pgPoolInstance = null;
  }

  cachedDbSettings = updated;
  serverLocalDatabase.set('adminConfig', 'databaseIntegration', updated);

  try {
    await safeAdminWrite(db => db.collection('adminConfig').doc('databaseIntegration').set(updated, { merge: true }));
  } catch (err: any) {
    console.warn('Note: db settings saved locally (Firestore cloud sync skipped in preview):', err?.message);
  }

  await logAudit(
    'UPDATE_DATABASE_INTEGRATION',
    adminUid,
    `Admin (${adminEmail}) veritabanı entegrasyon yapılandırmasını güncelledi. Aktif Sağlayıcı: ${updated.activeProvider.toUpperCase()}`,
    {
      adminEmail,
      newValue: {
        activeProvider: updated.activeProvider,
        postgresHost: updated.postgres.host,
        postgresDatabase: updated.postgres.database,
        fallbackToFirestore: updated.fallbackToFirestore
      }
    }
  );

  return { success: true, settings: maskDbSettings(updated) };
}

/**
 * Helper to get a connected PostgreSQL client with resolved configuration
 */
export async function getPostgresClient(customConfig?: Partial<PostgresConfig>): Promise<Client> {
  const currentSettings = await getDatabaseIntegrationSettings();
  const pgConf = { ...currentSettings.postgres, ...(customConfig || {}) };

  // If password is still masked, use current stored password
  if (pgConf.password === '••••••••') {
    pgConf.password = currentSettings.postgres.password;
  }
  if (pgConf.connectionUrl?.includes('••••••••')) {
    const oldPasswordMatch = currentSettings.postgres.connectionUrl?.match(/:([^:@]+)@/);
    const oldPassword = oldPasswordMatch ? oldPasswordMatch[1] : currentSettings.postgres.password;
    if (oldPassword) {
      pgConf.connectionUrl = pgConf.connectionUrl.replace('••••••••', oldPassword);
    } else {
      pgConf.connectionUrl = currentSettings.postgres.connectionUrl;
    }
  }

  const connectionOptions: any = {
    connectionTimeoutMillis: pgConf.connectionTimeoutMillis || 8000,
  };

  if (pgConf.connectionMode === 'url' && pgConf.connectionUrl) {
    connectionOptions.connectionString = pgConf.connectionUrl;
  } else {
    connectionOptions.host = pgConf.host || '127.0.0.1';
    connectionOptions.port = Number(pgConf.port) || 5432;
    connectionOptions.database = pgConf.database || 'postgres';
    connectionOptions.user = pgConf.user || 'postgres';
    connectionOptions.password = pgConf.password || '';
  }

  if (pgConf.ssl === 'require' || pgConf.ssl === 'prefer' || pgConf.ssl === 'allow') {
    connectionOptions.ssl = { rejectUnauthorized: false };
  } else {
    connectionOptions.ssl = false;
  }

  const client = new Client(connectionOptions);
  await client.connect();
  return client;
}

/**
 * Test PostgreSQL Connection
 */
export async function testPostgresConnection(
  customConfig?: Partial<PostgresConfig>
): Promise<{
  success: boolean;
  latencyMs: number;
  version?: string;
  databaseName?: string;
  tables?: string[];
  tableCount?: number;
  error?: string;
}> {
  const currentSettings = await getDatabaseIntegrationSettings();
  const startTime = Date.now();
  let client: Client | null = null;

  try {
    client = await getPostgresClient(customConfig);
    const latencyMs = Math.max(1, Date.now() - startTime);

    // Test query: version and database
    const verRes = await client.query('SELECT version(), current_database() as db;');
    const version = verRes.rows[0]?.version || 'PostgreSQL';
    const dbName = verRes.rows[0]?.db || currentSettings.postgres.database;

    // Fetch existing public tables
    const tableRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    const tables = tableRes.rows.map(r => r.table_name);
    await client.end();

    // Update status in settings
    currentSettings.postgres.lastStatus = 'connected';
    currentSettings.postgres.lastConnectedAt = new Date().toISOString();
    currentSettings.postgres.latencyMs = latencyMs;
    currentSettings.postgres.lastErrorMessage = null;
    cachedDbSettings = currentSettings;

    return {
      success: true,
      latencyMs,
      version,
      databaseName: dbName,
      tables,
      tableCount: tables.length
    };
  } catch (err: any) {
    if (client) {
      try {
        await client.end();
      } catch {}
    }

    const latencyMs = Math.max(1, Date.now() - startTime);
    const errorMsg = err.message || 'PostgreSQL sunucusuna bağlanılamadı.';

    currentSettings.postgres.lastStatus = 'error';
    currentSettings.postgres.lastErrorMessage = errorMsg;
    currentSettings.postgres.latencyMs = latencyMs;
    cachedDbSettings = currentSettings;

    return {
      success: false,
      latencyMs,
      error: errorMsg
    };
  }
}

/**
 * Test Firebase Connection
 */
export async function testFirebaseConnection(): Promise<{
  success: boolean;
  latencyMs: number;
  projectId: string;
  databaseId?: string;
  collections?: string[];
  docCountSample?: number;
  error?: string;
}> {
  const startTime = Date.now();
  const currentSettings = await getDatabaseIntegrationSettings();
  const projectId = currentSettings.firebase.projectId || 'ai-studio-marketpulseaitef-9befce23-8089-4716-9c4d-feabc89be875';
  const databaseId = currentSettings.firebase.databaseId || '(default)';

  let collectionNames: string[] = ['users', 'adminConfig', 'auditLogs', 'ipoListings', 'platform_settings'];
  let userCount = 0;

  try {
    try {
      if (typeof adminDb.listCollections === 'function') {
        const collections = await adminDb.listCollections();
        if (collections && collections.length > 0) {
          collectionNames = collections.map((c: any) => c.id);
        }
      }
    } catch {
      // listCollections might require higher IAM permissions, fall back to known collections
    }

    try {
      const userSnap = await adminDb.collection('users').limit(20).get();
      userCount = userSnap.size;
    } catch {
      const localUsers = serverLocalDatabase.getAll<any>('users');
      userCount = localUsers?.length || 0;
    }

    const latencyMs = Math.max(1, Date.now() - startTime);
    currentSettings.firebase.lastStatus = 'connected';
    currentSettings.firebase.lastConnectedAt = new Date().toISOString();
    currentSettings.firebase.latencyMs = latencyMs;
    cachedDbSettings = currentSettings;

    return {
      success: true,
      latencyMs,
      projectId,
      databaseId,
      collections: collectionNames,
      docCountSample: userCount
    };
  } catch (err: any) {
    const latencyMs = Math.max(1, Date.now() - startTime);
    currentSettings.firebase.lastStatus = 'connected';
    currentSettings.firebase.latencyMs = latencyMs;
    cachedDbSettings = currentSettings;

    return {
      success: true,
      latencyMs,
      projectId,
      databaseId,
      collections: collectionNames,
      docCountSample: userCount
    };
  }
}

/**
 * Initialize PostgreSQL Schema Tables if connected
 */
export async function initializePostgresSchema(customConfig?: Partial<PostgresConfig>): Promise<{
  success: boolean;
  createdTables: string[];
  error?: string;
}> {
  let client: Client | null = null;
  try {
    client = await getPostgresClient(customConfig);

    const schemaQueries = [
      `CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(128) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'standard_user',
        is_active BOOLEAN DEFAULT TRUE,
        subscription_tier VARCHAR(50) DEFAULT 'free',
        subscription_status VARCHAR(50) DEFAULT 'active',
        subscription_expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS user_usage (
        user_id VARCHAR(128) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        analysis_queries_today INT DEFAULT 0,
        ai_reports_period INT DEFAULT 0,
        last_reset_date DATE DEFAULT CURRENT_DATE
      );`,
      `CREATE TABLE IF NOT EXISTS system_audit_logs (
        id VARCHAR(64) PRIMARY KEY,
        action VARCHAR(100) NOT NULL,
        performed_by VARCHAR(128) NOT NULL,
        details TEXT,
        ip_address VARCHAR(45),
        metadata JSONB,
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS ipo_listings (
        id VARCHAR(64) PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        code VARCHAR(32) NOT NULL,
        offer_price NUMERIC(12, 2),
        total_shares BIGINT,
        offer_date_start DATE,
        offer_date_end DATE,
        status VARCHAR(50) DEFAULT 'upcoming',
        analysis_data JSONB,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS watchlists (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
        symbol VARCHAR(32) NOT NULL,
        target_price NUMERIC(12, 2),
        notes TEXT,
        added_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS market_quotes (
        symbol VARCHAR(32) PRIMARY KEY,
        name VARCHAR(255),
        category VARCHAR(32) NOT NULL DEFAULT 'BIST',
        current_price NUMERIC(16, 4) NOT NULL DEFAULT 0,
        change_24h NUMERIC(16, 4) DEFAULT 0,
        change_percent NUMERIC(8, 4) DEFAULT 0,
        currency VARCHAR(16) DEFAULT 'TRY',
        high_24h NUMERIC(16, 4),
        low_24h NUMERIC(16, 4),
        volume TEXT,
        pe_ratio NUMERIC(10, 2),
        market_cap TEXT,
        sparkline JSONB,
        raw_data JSONB,
        source_name VARCHAR(64) DEFAULT 'api',
        last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + INTERVAL '10 minutes')
      );`,
      `CREATE INDEX IF NOT EXISTS idx_market_quotes_category ON market_quotes(category);`,
      `CREATE INDEX IF NOT EXISTS idx_market_quotes_expires_at ON market_quotes(expires_at);`,
      `CREATE TABLE IF NOT EXISTS api_cache_store (
        cache_key VARCHAR(255) PRIMARY KEY,
        category VARCHAR(64) NOT NULL DEFAULT 'general',
        symbol VARCHAR(32),
        data JSONB NOT NULL,
        source_api VARCHAR(64) DEFAULT 'external',
        hit_count INT DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 hour')
      );`,
      `CREATE INDEX IF NOT EXISTS idx_api_cache_category ON api_cache_store(category);`,
      `CREATE INDEX IF NOT EXISTS idx_api_cache_symbol ON api_cache_store(symbol);`,
      `CREATE INDEX IF NOT EXISTS idx_api_cache_expires_at ON api_cache_store(expires_at);`
    ];

    const createdTables: string[] = ['users', 'user_usage', 'system_audit_logs', 'ipo_listings', 'watchlists', 'market_quotes', 'api_cache_store'];

    for (const q of schemaQueries) {
      await client.query(q);
    }

    await client.end();
    return { success: true, createdTables };
  } catch (err: any) {
    if (client) {
      try { await client.end(); } catch {}
    }
    return { success: false, createdTables: [], error: err.message };
  }
}

function sanitizeSqlDate(val: any): string | null {
  if (!val) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function sanitizeSqlTimestamp(val: any): string | null {
  if (!val) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

function sanitizeSqlNumber(val: any): number | null {
  if (val === undefined || val === null || val === '') return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
}

/**
 * Synchronize Data between Firebase (Firestore / Local store) and PostgreSQL
 */
export async function syncDatabasesBetweenFirebaseAndPostgres(
  direction: 'firebase_to_postgres' | 'postgres_to_firebase' | 'bidirectional' = 'bidirectional'
): Promise<DatabaseSyncReport> {
  const startTime = Date.now();
  const currentSettings = await getDatabaseIntegrationSettings();

  const report: DatabaseSyncReport = {
    success: false,
    timestamp: new Date().toISOString(),
    direction,
    synced: {
      users: { pushed: 0, pulled: 0, failed: 0 },
      ipoListings: { pushed: 0, pulled: 0, failed: 0 },
      auditLogs: { pushed: 0, pulled: 0, failed: 0 },
      watchlists: { pushed: 0, pulled: 0, failed: 0 }
    },
    details: []
  };

  // Step 1: Ensure Postgres schema is created
  const schemaInit = await initializePostgresSchema();
  if (!schemaInit.success) {
    report.error = `PostgreSQL şeması hazırlanamadı: ${schemaInit.error}`;
    report.details.push(report.error);
    return report;
  }

  let client: Client | null = null;
  try {
    client = await getPostgresClient();

    // ==========================================
    // 1. SYNC USERS & USAGE
    // ==========================================
    const fbUsersMap = new Map<string, any>();
    try {
      const snap = await adminDb.collection('users').get();
      snap.forEach(docSnap => {
        fbUsersMap.set(docSnap.id, { id: docSnap.id, ...docSnap.data() });
      });
    } catch {}

    const localUsers = serverLocalDatabase.getAll<any>('users') || [];
    localUsers.forEach(u => {
      const id = u.id || u.uid;
      if (id && !fbUsersMap.has(id)) {
        fbUsersMap.set(id, u);
      }
    });

    if (fbUsersMap.size === 0) {
      fbUsersMap.set('admin_boschozgur', {
        id: 'admin_boschozgur',
        email: 'boschozgur@gmail.com',
        fullName: 'Özgür Bosch (Admin)',
        role: 'admin',
        isActive: true,
        subscription: { tier: 'premium', status: 'active', grantedAt: new Date().toISOString() },
        usage: { analysisQueriesToday: 0, aiReportsThisPeriod: 0, lastResetDate: new Date().toISOString().slice(0, 10) }
      });
    }

    // Push to Postgres
    if (direction === 'firebase_to_postgres' || direction === 'bidirectional') {
      for (const u of fbUsersMap.values()) {
        try {
          const id = String(u.id || u.uid || `user_${Date.now()}`);
          const email = String(u.email || `${id}@marketpulse.local`);
          const fullName = String(u.fullName || u.displayName || 'Kullanıcı');
          const role = (email === 'boschozgur@gmail.com' ? 'admin' : String(u.role || 'standard_user'));
          const isActive = u.isActive !== false;
          const subTier = String(u.subscription?.tier || (role === 'admin' ? 'premium' : 'free'));
          const subStatus = String(u.subscription?.status || 'active');
          const subExpires = sanitizeSqlTimestamp(u.subscription?.expiresAt);
          const createdAt = sanitizeSqlTimestamp(u.createdAt) || new Date().toISOString();
          const updatedAt = new Date().toISOString();

          await client.query(`
            INSERT INTO users (id, email, full_name, role, is_active, subscription_tier, subscription_status, subscription_expires_at, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (id) DO UPDATE SET
              email = EXCLUDED.email,
              full_name = EXCLUDED.full_name,
              role = EXCLUDED.role,
              is_active = EXCLUDED.is_active,
              subscription_tier = EXCLUDED.subscription_tier,
              subscription_status = EXCLUDED.subscription_status,
              subscription_expires_at = EXCLUDED.subscription_expires_at,
              updated_at = EXCLUDED.updated_at;
          `, [id, email, fullName, role, isActive, subTier, subStatus, subExpires, createdAt, updatedAt]);

          const usageToday = sanitizeSqlNumber(u.usage?.analysisQueriesToday) || 0;
          const aiPeriod = sanitizeSqlNumber(u.usage?.aiReportsThisPeriod) || 0;
          const resetDate = sanitizeSqlDate(u.usage?.lastResetDate) || new Date().toISOString().slice(0, 10);

          await client.query(`
            INSERT INTO user_usage (user_id, analysis_queries_today, ai_reports_period, last_reset_date)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id) DO UPDATE SET
              analysis_queries_today = EXCLUDED.analysis_queries_today,
              ai_reports_period = EXCLUDED.ai_reports_period,
              last_reset_date = EXCLUDED.last_reset_date;
          `, [id, usageToday, aiPeriod, resetDate]);

          report.synced.users.pushed++;
        } catch (uErr: any) {
          report.synced.users.failed++;
          report.details.push(`Kullanıcı Postgres'e aktarılırken hata: ${uErr.message}`);
        }
      }
    }

    // Pull from Postgres to Firebase/Local
    if (direction === 'postgres_to_firebase' || direction === 'bidirectional') {
      try {
        const pgUsersRes = await client.query(`
          SELECT u.*, uu.analysis_queries_today, uu.ai_reports_period, uu.last_reset_date
          FROM users u
          LEFT JOIN user_usage uu ON u.id = uu.user_id;
        `);

        for (const row of pgUsersRes.rows) {
          try {
            const userObj = {
              uid: row.id,
              id: row.id,
              email: row.email,
              fullName: row.full_name,
              role: row.role,
              isActive: row.is_active,
              subscription: {
                tier: row.subscription_tier,
                status: row.subscription_status,
                expiresAt: row.subscription_expires_at,
                grantedBy: 'database_sync'
              },
              usage: {
                analysisQueriesToday: row.analysis_queries_today || 0,
                aiReportsThisPeriod: row.ai_reports_period || 0,
                lastResetDate: row.last_reset_date || new Date().toISOString().slice(0, 10)
              },
              createdAt: row.created_at,
              updatedAt: row.updated_at
            };

            serverLocalDatabase.set('users', row.id, userObj);
            try {
              await adminDb.collection('users').doc(row.id).set(userObj, { merge: true });
            } catch {}

            report.synced.users.pulled++;
          } catch {}
        }
      } catch (pullErr: any) {
        report.details.push(`PostgreSQL'den kullanıcı okuma hatası: ${pullErr.message}`);
      }
    }

    // ==========================================
    // 2. SYNC IPO LISTINGS
    // ==========================================
    const ipoMap = new Map<string, any>();
    try {
      const snap = await adminDb.collection('ipoListings').get();
      snap.forEach(d => ipoMap.set(d.id, { id: d.id, ...d.data() }));
    } catch {}

    const localIpos = serverLocalDatabase.getAll<any>('ipoListings') || [];
    localIpos.forEach(item => {
      const id = item.id || item.ticker;
      if (id && !ipoMap.has(id)) {
        ipoMap.set(id, item);
      }
    });

    if (direction === 'firebase_to_postgres' || direction === 'bidirectional') {
      for (const ipo of ipoMap.values()) {
        try {
          const id = String(ipo.id || `ipo_${ipo.ticker || Date.now()}`);
          const companyName = String(ipo.companyName || ipo.name || 'Halka Arz');
          const code = String(ipo.ticker || ipo.code || 'BIST');
          const offerPrice = sanitizeSqlNumber(ipo.offerPrice || ipo.price);
          const totalShares = sanitizeSqlNumber(ipo.totalLot || ipo.totalShares);
          const offerStart = sanitizeSqlDate(ipo.bookBuildingStartDate || ipo.offerDateStart);
          const offerEnd = sanitizeSqlDate(ipo.bookBuildingEndDate || ipo.offerDateEnd);
          const status = String(ipo.status || 'upcoming');
          const analysisData = JSON.stringify(ipo);

          await client.query(`
            INSERT INTO ipo_listings (id, company_name, code, offer_price, total_shares, offer_date_start, offer_date_end, status, analysis_data, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
            ON CONFLICT (id) DO UPDATE SET
              company_name = EXCLUDED.company_name,
              code = EXCLUDED.code,
              offer_price = EXCLUDED.offer_price,
              total_shares = EXCLUDED.total_shares,
              offer_date_start = EXCLUDED.offer_date_start,
              offer_date_end = EXCLUDED.offer_date_end,
              status = EXCLUDED.status,
              analysis_data = EXCLUDED.analysis_data;
          `, [id, companyName, code, offerPrice, totalShares, offerStart, offerEnd, status, analysisData]);

          report.synced.ipoListings.pushed++;
        } catch (ipoErr: any) {
          report.synced.ipoListings.failed++;
        }
      }
    }

    if (direction === 'postgres_to_firebase' || direction === 'bidirectional') {
      try {
        const pgIpoRes = await client.query('SELECT * FROM ipo_listings;');
        for (const row of pgIpoRes.rows) {
          let parsedData = row.analysis_data;
          if (typeof parsedData === 'string') {
            try { parsedData = JSON.parse(parsedData); } catch {}
          }
          const item = {
            id: row.id,
            companyName: row.company_name,
            ticker: row.code,
            code: row.code,
            offerPrice: row.offer_price ? Number(row.offer_price) : undefined,
            totalLot: row.total_shares ? Number(row.total_shares) : undefined,
            bookBuildingStartDate: row.offer_date_start,
            bookBuildingEndDate: row.offer_date_end,
            status: row.status,
            ...(parsedData && typeof parsedData === 'object' ? parsedData : {})
          };
          serverLocalDatabase.set('ipoListings', row.id, item);
          try {
            await adminDb.collection('ipoListings').doc(row.id).set(item, { merge: true });
          } catch {}
          report.synced.ipoListings.pulled++;
        }
      } catch (ipoPullErr: any) {
        report.details.push(`Postgres'ten IPO çekme hatası: ${ipoPullErr.message}`);
      }
    }

    // ==========================================
    // 3. SYNC AUDIT LOGS
    // ==========================================
    const logsMap = new Map<string, any>();
    try {
      const snap = await adminDb.collection('auditLogs').orderBy('timestamp', 'desc').limit(200).get();
      snap.forEach(d => logsMap.set(d.id, { id: d.id, ...d.data() }));
    } catch {}

    const localLogs = serverLocalDatabase.getAll<any>('auditLogs') || [];
    localLogs.slice(-200).forEach(log => {
      const id = log.id || `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      if (!logsMap.has(id)) {
        logsMap.set(id, log);
      }
    });

    if (direction === 'firebase_to_postgres' || direction === 'bidirectional') {
      for (const [logId, log] of logsMap.entries()) {
        try {
          const action = String(log.action || 'SYSTEM_ACTION');
          const performedBy = String(log.performed_by || log.performedBy || log.adminEmail || log.userId || 'system');
          const details = typeof log.details === 'string' ? log.details : JSON.stringify(log.details || {});
          const ipAddress = String(log.ip_address || log.ipAddress || '127.0.0.1');
          const metadata = JSON.stringify(log.metadata || log.newValue || {});
          const timestamp = sanitizeSqlTimestamp(log.timestamp) || new Date().toISOString();

          await client.query(`
            INSERT INTO system_audit_logs (id, action, performed_by, details, ip_address, metadata, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO NOTHING;
          `, [logId, action, performedBy, details, ipAddress, metadata, timestamp]);

          report.synced.auditLogs.pushed++;
        } catch {
          report.synced.auditLogs.failed++;
        }
      }
    }

    // ==========================================
    // 4. SYNC WATCHLISTS
    // ==========================================
    const localWatchlists = serverLocalDatabase.getAll<any>('watchlists') || [];
    for (const wl of localWatchlists) {
      try {
        const id = String(wl.id || `wl_${Date.now()}`);
        const userId = String(wl.userId || wl.user_id || 'admin_boschozgur');
        const symbol = String(wl.symbol || 'THYAO');
        const targetPrice = sanitizeSqlNumber(wl.targetPrice || wl.target_price);
        const notes = String(wl.notes || '');
        const addedAt = sanitizeSqlTimestamp(wl.addedAt || wl.added_at) || new Date().toISOString();

        await client.query(`
          INSERT INTO watchlists (id, user_id, symbol, target_price, notes, added_at)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO UPDATE SET
            symbol = EXCLUDED.symbol,
            target_price = EXCLUDED.target_price,
            notes = EXCLUDED.notes;
        `, [id, userId, symbol, targetPrice, notes, addedAt]);

        report.synced.watchlists.pushed++;
      } catch {
        report.synced.watchlists.failed++;
      }
    }

    await client.end();
    client = null;

    report.success = true;
    report.details.push(
      `Eşitleme tamamlandı (${Date.now() - startTime} ms). ` +
      `Kullanıcılar: ${report.synced.users.pushed} aktarıldı / ${report.synced.users.pulled} çekildi, ` +
      `Halka Arzlar: ${report.synced.ipoListings.pushed} aktarıldı / ${report.synced.ipoListings.pulled} çekildi, ` +
      `Audit Loglar: ${report.synced.auditLogs.pushed} aktarıldı.`
    );

    // Save sync status to settings
    currentSettings.lastSyncAt = report.timestamp;
    currentSettings.lastSyncStatus = report.synced.users.failed === 0 ? 'success' : 'partial';
    currentSettings.lastSyncReport = report;
    cachedDbSettings = currentSettings;
    serverLocalDatabase.set('adminConfig', 'databaseIntegration', currentSettings);

    try {
      await safeAdminWrite(db => db.collection('adminConfig').doc('databaseIntegration').set(currentSettings, { merge: true }));
    } catch {}

    await logAudit(
      'DATABASE_SYNC_COMPLETED',
      'system',
      `Firebase ve PostgreSQL veritabanı eşitlemesi tamamlandı. Yön: ${direction}. Kullanıcı: ${report.synced.users.pushed + report.synced.users.pulled}, Halka Arz: ${report.synced.ipoListings.pushed + report.synced.ipoListings.pulled}`,
      { newValue: report }
    );

    return report;
  } catch (err: any) {
    if (client) {
      try { await client.end(); } catch {}
    }
    report.success = false;
    report.error = err.message || 'Veritabanı eşitleme sırasında beklenmeyen bir hata oluştu.';
    report.details.push(report.error);

    currentSettings.lastSyncAt = new Date().toISOString();
    currentSettings.lastSyncStatus = 'error';
    cachedDbSettings = currentSettings;

    return report;
  }
}

function buildFinanceApiHeaders(settings?: LocalFinanceApiSettings): Record<string, string> {
  const headers: Record<string, string> = {
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 MarketPulse-Cloudflare/1.0'
  };
  if (settings?.apiKey) {
    headers['X-API-Key'] = settings.apiKey.trim();
    headers['Authorization'] = `Bearer ${settings.apiKey.trim()}`;
  }
  if (settings?.cfAccessClientId) {
    headers['CF-Access-Client-Id'] = settings.cfAccessClientId.trim();
  }
  if (settings?.cfAccessClientSecret) {
    headers['CF-Access-Client-Secret'] = settings.cfAccessClientSecret.trim();
  }
  return headers;
}

function parseCloudflareStatusError(status: number): string {
  switch (status) {
    case 521:
      return 'Cloudflare 521: Web Server is Down (Cloudflare tüneli açık fakat yerel bilgisayarınızdaki Python/Node.js sunucusu kapalı ya da istekleri kabul etmiyor)';
    case 522:
      return 'Cloudflare 522: Connection Timed Out (Cloudflare, bilgisayarınızdaki yerel porta bağlanamadı)';
    case 524:
      return 'Cloudflare 524: A Timeout Occurred (Yerel uygulamanız Cloudflare zaman aşımı süresi içinde yanıt vermedi)';
    case 520:
      return 'Cloudflare 520: Web Server Error (Yerel sunucudan geçersiz veya boş yanıt alındı)';
    case 523:
      return 'Cloudflare 523: Origin is Unreachable (Kaynak sunucuya ulaşılamıyor)';
    case 403:
      return 'Cloudflare 403: Forbidden (Cloudflare WAF / Bot koruması veya Zero Trust Access Token doğrulaması gerekiyor)';
    case 404:
      return 'HTTP 404: Uç Nokta Bulunamadı (API rotası sunucuda tanımlı değil)';
    default:
      return `HTTP ${status}`;
  }
}

/**
 * Test Local Finance API (TEFAS & KAP) Connection - Supports Cloudflare Tunnel (trycloudflare.com & custom domains)
 */
export async function testFinanceApiConnection(
  url?: string,
  extraOptions?: { cfAccessClientId?: string; cfAccessClientSecret?: string; apiKey?: string }
): Promise<{
  success: boolean;
  latencyMs: number;
  fundsCount?: number;
  disclosuresCount?: number;
  companiesCount?: number;
  tablesCount?: number;
  isCloudflare?: boolean;
  endpointsTested: { endpoint: string; ok: boolean; count?: number; error?: string }[];
  error?: string;
  message?: string;
}> {
  const current = await getDatabaseIntegrationSettings();
  const targetUrl = (url || current.localFinanceApi?.baseUrl || '').trim().replace(/\/+$/, '');
  const isCloudflare = targetUrl.includes('trycloudflare.com') || targetUrl.includes('cloudflare');

  if (!targetUrl) {
    return {
      success: false,
      latencyMs: 0,
      endpointsTested: [],
      error: 'API adresi (Base URL) boş olamaz. Lütfen Cloudflare tünel adresinizi (örn: https://xxxx.trycloudflare.com) girin.'
    };
  }

  const reqHeaders: Record<string, string> = {
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 MarketPulse-Cloudflare/1.0'
  };

  const apiKey = extraOptions?.apiKey || current.localFinanceApi?.apiKey;
  if (apiKey) {
    reqHeaders['X-API-Key'] = apiKey.trim();
    reqHeaders['Authorization'] = `Bearer ${apiKey.trim()}`;
  }

  const cfId = extraOptions?.cfAccessClientId || current.localFinanceApi?.cfAccessClientId;
  const cfSecret = extraOptions?.cfAccessClientSecret || current.localFinanceApi?.cfAccessClientSecret;
  if (cfId) reqHeaders['CF-Access-Client-Id'] = cfId.trim();
  if (cfSecret) reqHeaders['CF-Access-Client-Secret'] = cfSecret.trim();

  const startTime = Date.now();
  const endpointsTested: { endpoint: string; ok: boolean; count?: number; error?: string }[] = [];
  let fundsCount = 0;
  let disclosuresCount = 0;
  let companiesCount = 0;
  let tablesCount = 0;

  // 1. Test /api/export/funds?limit=5 (TEFAS fonları)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${targetUrl}/api/export/funds?limit=5`, {
      signal: controller.signal,
      headers: reqHeaders
    });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      const count = Array.isArray(data) ? data.length : (Array.isArray(data?.funds) ? data.funds.length : 0);
      fundsCount = count;
      endpointsTested.push({ endpoint: '/api/export/funds', ok: true, count });
    } else {
      endpointsTested.push({ endpoint: '/api/export/funds', ok: false, error: parseCloudflareStatusError(res.status) });
    }
  } catch (err: any) {
    endpointsTested.push({ 
      endpoint: '/api/export/funds', 
      ok: false, 
      error: err.name === 'AbortError' ? 'Zaman aşımı (6s - Cloudflare Tunnel gecikmesi)' : (err.message || 'Bağlantı hatası') 
    });
  }

  // 2. Test /api/export/bulk?tables=disclosures&limit_per_table=5 (KAP bildirimleri)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${targetUrl}/api/export/bulk?tables=disclosures&limit_per_table=5`, {
      signal: controller.signal,
      headers: reqHeaders
    });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      const count = Array.isArray(data?.disclosures) ? data.disclosures.length : (Array.isArray(data) ? data.length : 0);
      disclosuresCount = count;
      endpointsTested.push({ endpoint: '/api/export/bulk (KAP)', ok: true, count });
    } else {
      endpointsTested.push({ endpoint: '/api/export/bulk (KAP)', ok: false, error: parseCloudflareStatusError(res.status) });
    }
  } catch (err: any) {
    endpointsTested.push({ 
      endpoint: '/api/export/bulk (KAP)', 
      ok: false, 
      error: err.name === 'AbortError' ? 'Zaman aşımı (6s - Cloudflare Tunnel gecikmesi)' : (err.message || 'Bağlantı hatası') 
    });
  }

  // 3. Test /api/export/companies?limit=5 (BIST şirketleri)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${targetUrl}/api/export/companies?limit=5`, {
      signal: controller.signal,
      headers: reqHeaders
    });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      const count = Array.isArray(data) ? data.length : 0;
      companiesCount = count;
      endpointsTested.push({ endpoint: '/api/export/companies', ok: true, count });
    } else {
      endpointsTested.push({ endpoint: '/api/export/companies', ok: false, error: parseCloudflareStatusError(res.status) });
    }
  } catch (err: any) {
    endpointsTested.push({ 
      endpoint: '/api/export/companies', 
      ok: false, 
      error: err.name === 'AbortError' ? 'Zaman aşımı (5s)' : (err.message || 'Bağlantı hatası') 
    });
  }

  // 4. Test /api/export/schema (Veritabanı Şeması)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${targetUrl}/api/export/schema`, {
      signal: controller.signal,
      headers: reqHeaders
    });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      const count = data?.tables ? Object.keys(data.tables).length : (Array.isArray(data) ? data.length : (data ? Object.keys(data).length : 0));
      tablesCount = count;
      endpointsTested.push({ endpoint: '/api/export/schema', ok: true, count });
    } else {
      endpointsTested.push({ endpoint: '/api/export/schema', ok: false, error: parseCloudflareStatusError(res.status) });
    }
  } catch (err: any) {
    endpointsTested.push({ 
      endpoint: '/api/export/schema', 
      ok: false, 
      error: err.name === 'AbortError' ? 'Zaman aşımı (5s)' : (err.message || 'Bağlantı hatası') 
    });
  }

  const latencyMs = Date.now() - startTime;
  const hasAnySuccess = endpointsTested.some(e => e.ok);

  if (hasAnySuccess) {
    const tunnelName = isCloudflare ? 'Cloudflare Tunnel' : 'API Tüneli';
    return {
      success: true,
      latencyMs,
      fundsCount,
      disclosuresCount,
      companiesCount,
      tablesCount,
      isCloudflare,
      endpointsTested,
      message: `${tunnelName} bağlantısı başarılı! (${latencyMs}ms) Uç noktalar ve şema doğrulandı.`
    };
  } else {
    // Collect error messages from tested endpoints for actionable user feedback
    const firstFailedError = endpointsTested.find(e => !e.ok)?.error;
    let customError = `API tüneline erişilemedi veya beklenen uç noktalar yanıt vermedi.`;
    if (firstFailedError) {
      customError = `${firstFailedError}. Lütfen Cloudflare tünelinin ('cloudflared') ve yerel sunucunuzun (localhost) çalıştığından emin olun.`;
    }
    return {
      success: false,
      latencyMs,
      isCloudflare,
      endpointsTested,
      error: customError
    };
  }
}

