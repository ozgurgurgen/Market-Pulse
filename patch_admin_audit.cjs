const fs = require('fs');
let text = fs.readFileSync('src/components/AdminSettingsSection.tsx', 'utf8');

text = text.replace(
  "import { doc, getDoc, setDoc, collection, getDocs, updateDoc } from 'firebase/firestore';",
  "import { doc, getDoc, setDoc, collection, getDocs, updateDoc, query, orderBy, limit } from 'firebase/firestore';"
);

text = text.replace(
  "const [roles, setRoles] = useState<any[]>([]);\n  const [loading, setLoading] = useState(true);",
  "const [roles, setRoles] = useState<any[]>([]);\n  const [auditLogs, setAuditLogs] = useState<any[]>([]);\n  const [loading, setLoading] = useState(true);"
);

text = text.replace(
  "setRoles(fetchedRoles);\n      setLoading(false);",
  `setRoles(fetchedRoles);
      
      // Fetch audit logs
      try {
        const q = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'), limit(50));
        const logsSnap = await getDocs(q);
        setAuditLogs(logsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("Failed to fetch audit logs", e);
      }
      
      setLoading(false);`
);

const auditHtml = `
      {/* Audit Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg overflow-x-auto">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
          <ShieldCheck className="text-red-400" size={18} />
          <h2 className="font-bold text-slate-100">Güvenlik Denetim Günlüğü (Audit Logs)</h2>
        </div>
        
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="px-4 py-2 rounded-tl-lg">Tarih</th>
              <th className="px-4 py-2">İşlem</th>
              <th className="px-4 py-2">Kullanıcı (UID)</th>
              <th className="px-4 py-2 rounded-tr-lg">Detay</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2 text-amber-400">{log.action}</td>
                <td className="px-4 py-2 font-mono text-[10px]">{log.user_id}</td>
                <td className="px-4 py-2">{log.details}</td>
              </tr>
            ))}
            {auditLogs.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-4 text-center text-slate-500">Kayıt bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};`;

text = text.replace(
  "</div>\n  );\n};",
  auditHtml
);

fs.writeFileSync('src/components/AdminSettingsSection.tsx', text);
