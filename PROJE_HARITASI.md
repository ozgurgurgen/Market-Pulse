# Proje Klasör ve Dosya Haritası

## 1. Özet
- **Toplam Dosya Sayısı:** 44679 (`find . -type f | wc -l` ile doğrulandı)
- **Toplam Klasör Sayısı:** 7026 (`find . -type d | wc -l` ile doğrulandı)
- **Ana Dizin Grupları:** Frontend (`src/`), Backend (`server/`), Dokümantasyon, Yama/Test Scriptleri.

### Hariç Tutulan Klasörler
| Klasör | Dosya Sayısı | Boyut | Neden Hariç Tutuldu |
|---|---|---|---|
| `node_modules/` | 44,243 | 489M | Üçüncü parti bağımlılıklar (otomatik üretilmiş kütüphaneler). |

*Not: `.git`, `dist`, `build` gibi klasörler proje kökünde bulunmamaktadır.*

## 2. Tam Klasör Ağacı
```text
node_modules/ (44,243 dosya, hariç tutuldu - bağımlılık)
./
    .env.example
    .gitignore
    FAZ5_PRODUCTION_REPORT.md
    FAZ5_SECURITY_PROOF.md
    FAZ6_MODUL2_REPORT.md
    MARKETPULSE_AI_TECHNICAL_SPECIFICATION_AND_SYSTEM_REPORT.md
    PROGRESS.md
    RAPOR.md
    RAPOR_SINYAL_VE_AI_YORUMLAMA.md
    README_Data_Integrity.md
    SIGNAL_ENGINE_V2_TEST_REPORT.md
    add_tefas_radar.sh
    bootstrap_roles.cjs
    bootstrap_roles.ts
    bun.lock
    firebase-applet-config.json
    firebase-blueprint.json
    firestore.rules
    fix_all.sh
    fix_file.js
    fix_final.sh
    fix_news_speed.js
    fix_search.sh
    fix_server.sh
    fix_server2.sh
    fix_server3.js
    fix_sidebar.js
    fix_tefas.js
    fix_tefas.py
    generate_tree.py
    get-errors.ts
    get_atr.ts
    index.html
    metadata.json
    mod3-leak-results.txt
    mod3-results.txt
    nice_tree.txt
    package-lock.json
    package.json
    package.json.new
    package.json.patch
    patch-server.cjs
    patch-service.cjs
    patch.cjs
    patch2.cjs
    patch3.cjs
    patch_academy_topics.cjs
    patch_academy_topics.js
    patch_admin_audit.cjs
    patch_admin_auth.cjs
    patch_admin_import.cjs
    patch_admin_service.cjs
    patch_admin_settings.cjs
    patch_app.cjs
    patch_app2.cjs
    patch_app_admin.cjs
    patch_app_auth.cjs
    patch_app_hooks.cjs
    patch_app_modelconfig.cjs
    patch_app_persistence.cjs
    patch_app_radar.sh
    patch_app_settings.sh
    patch_app_tabs.cjs
    patch_app_watchlist_sync.cjs
    patch_auth_audit.cjs
    patch_auth_google.cjs
    patch_auth_hasperm.cjs
    patch_auth_middleware.cjs
    patch_auth_permissions.cjs
    patch_auth_portfolio.cjs
    patch_bot.cjs
    patch_chat2.cjs
    patch_chat_persistence.cjs
    patch_digest.cjs
    patch_error_log.cjs
    patch_errors.cjs
    patch_flags.cjs
    patch_header.cjs
    patch_header_search.sh
    patch_intel_telegram.cjs
    patch_layout.sh
    patch_main.cjs
    patch_main2.cjs
    patch_masker.cjs
    patch_modal_news.sh
    patch_news.sh
    patch_news_speed.sh
    patch_orchestrator.cjs
    patch_orchestrator2.cjs
    patch_paths.cjs
    patch_paths_fixed.cjs
    patch_plans.cjs
    patch_portfolio_router.cjs
    patch_prompt.sh
    patch_ratelimit.cjs
    patch_ratelimit2.cjs
    patch_routers.cjs
    patch_rules.cjs
    patch_rules_v2.cjs
    patch_scanner.sh
    patch_server.cjs
    patch_server.sh
    patch_server_auth.cjs
    patch_server_cron.cjs
    patch_server_opportunities.sh
    patch_server_rbac.cjs
    patch_server_search.sh
    patch_server_security.cjs
    patch_server_telegram.cjs
    patch_settings_tab.cjs
    patch_settings_ui.cjs
    patch_sidebar.sh
    patch_sidebar_admin_tab.cjs
    patch_sidebar_fix.cjs
    patch_sidebar_hasperm.cjs
    patch_sidebar_imports.cjs
    patch_sidebar_props.cjs
    patch_sidebar_rbac.cjs
    patch_sidebar_shield.cjs
    patch_sidebar_tabitem.cjs
    patch_sidebar_types.cjs
    patch_sub_service.cjs
    patch_tefas_funds.sh
    patch_tele.cjs
    patch_tele.js
    patch_telegram.cjs
    patch_temperature.sh
    patch_useportfolio.cjs
    patch_useportfolio2.cjs
    patch_vite_pwa.cjs
    patch_yahoo.cjs
    patch_yahoo_log.cjs
    rewrite_academy.cjs
    run_v6.1_backtest.ts
    run_v6.3_backtest.ts
    run_v6.4_backtest.ts
    run_v6.5_backtest.ts
    seed-admin.ts
    server.ts
    server_logs.txt
    server_logs2.txt
    test-admin-auth.ts
    test-admin-db.ts
    test-admin-perm.ts
    test-admin-raw.ts
    test-admin-read.ts
    test-admin-real.sh
    test-admin-rules.sh
    test-admin-rules2.sh
    test-admin-services.ts
    test-auth-rules.js
    test-client.cjs
    test-concurrency.ts
    test-critical-path.ts
    test-e2e-integrity.ts
    test-errors.ts
    test-escalation.sh
    test-escalation3.sh
    test-fetch.js
    test-firestore-rules.js
    test-html.cjs
    test-html2.cjs
    test-html3.cjs
    test-html4.cjs
    test-mint.js
    test-mod1-scenario-b.sh
    test-mod1-scenarios.ts
    test-mod3-health-runner.ts
    test-mod3-loadtest.ts
    test-mod3-real.ts
    test-mod4-paywall.ts
    test-p-limit.js
    test-paywall.ts
    test-puppeteer.cjs
    test-rest-parse.ts
    test-rest.sh
    test-rest.ts
    test-stage1-migration.ts
    test-trick.cjs
    test-trick.ts
    test-tsx.cjs
    test-tsx.ts
    test-worker-health-monitor.ts
    test-yf.cjs
    test-yf2.cjs
    test-yf3.cjs
    test-yf4.cjs
    tree.txt
    tsconfig.json
    update_academy_section.cjs
    update_app_academy_nav.cjs
    update_readme.cjs
    vite.config.ts
    wait_for_build.sh
    wait_for_pup.sh
    src/
        App.tsx
        index.css
        main.tsx
        types.ts
        components/
            AIChatAdvisor.tsx
            AIModelSettingsModal.tsx
            AcademyTooltip.tsx
            AdminPanel.tsx
            AdminSettingsSection.tsx
            AdvancedScreenerSection.tsx
            AuthScreen.tsx
            BacktestSection.tsx
            ErrorBoundary.tsx
            FinancialAcademySection.tsx
            Header.tsx
            IPOTracker.tsx
            LatestBalanceSheetsSection.tsx
            MarketNewsSection.tsx
            MarketOverview.tsx
            MarketTickerBar.tsx
            OfflineIndicator.tsx
            OpportunityScanner.tsx
            PWAInstallPrompt.tsx
            SettingsSection.tsx
            Sidebar.tsx
            SignalEngineV2Modal.tsx
            StockAnalysisModal.tsx
            TefasAiRadarModal.tsx
            TefasFundDetailModal.tsx
            TefasFundsSection.tsx
            WatchlistManager.tsx
            admin/
                AdminAiSettingsTab.tsx
                AdminApiManagementTab.tsx
                AdminAuditLogsTab.tsx
                AdminDatabaseIntegrationTab.tsx
                AdminErrorLogsTab.tsx
                AdminIpoManagementTab.tsx
                AdminOverviewTab.tsx
                AdminPlatformTab.tsx
                AdminSubscriptionTuningTab.tsx
                AdminUserManagementTab.tsx
            EconomicIndicators/
                AssetImpactSection.tsx
                EconomicIndicatorsPage.tsx
                MacroChartsSection.tsx
                MultiIndicatorChartCard.tsx
            StockAnalysis/
                CompanyThesisTab.tsx
                CorporateEventsTab.tsx
                FinancialStatementsTab.tsx
                FundPositionsTab.tsx
                FundamentalValuationTab.tsx
                InteractiveStockPriceChart.tsx
                MultiplesAnalysisTab.tsx
                PeerComparisonTab.tsx
                ScorecardTab.tsx
                SeasonalityTab.tsx
                StockBrokerageDistribution.tsx
                SubsidiariesAndGovernanceTab.tsx
                TechnicalEngineTab.tsx
                WhatIfValuationSimulator.tsx
            Subscription/
                FeatureLockOverlay.tsx
                PricingSection.tsx
                UpgradeModal.tsx
            TefasAnalysis/
                TefasFundAumTrend.tsx
                TefasFundComparisonChart.tsx
                TefasFundOperationalInfo.tsx
                TefasFundPeerComparison.tsx
                TefasFundRiskMetrics.tsx
            ui/
                LockedField.tsx
                ValidationBadge.tsx
            IntelligenceHub/
                IntelligenceHeader.tsx
                IntelligenceHub.tsx
                IntelligenceSearchBar.tsx
                NewsFeedPanel.tsx
                OrchestratorSummaryPanel.tsx
                SentimentPanel.tsx
                SourceHealthBanner.tsx
                TechnicalPanel.tsx
                TelegramStatusPanel.tsx
        pages/
            Portfolio/
                index.tsx
                components/
                    AIRecommendations.tsx
                    AddHoldingModal.tsx
                    BacktestPanel.tsx
                    CreatePortfolioModal.tsx
                    HoldingsTable.tsx
                    PortfolioChart.tsx
                    PortfolioSummary.tsx
                    RiskPanel.tsx
                    TelegramAlertsModal.tsx
                hooks/
                    usePortfolio.ts
                    usePortfolioAI.ts
                    usePortfolioBacktest.ts
        utils/
            apiClient.ts
            clientErrorLogger.ts
            exportUtils.ts
            ipoAnalysisUtils.ts
        lib/
            firebase.ts
        data/
            defaultQuotesData.ts
            newsData.ts
            tefasFundsData.ts
        services/
            firebaseClient.ts
            localDatabaseService.ts
            oracleDatabaseService.ts
        contexts/
            AdminConfigContext.tsx
            AuthContext.tsx
        config/
            paywallConfig.ts
        shared/
            subscriptionPlans.ts
        hooks/
            useSubscription.ts
    server/
        POST_DEPLOY_CHECKLIST.md
        README_DEPLOYMENT.md
        aiService.ts
        backtestService.ts
        macroCommentaryService.ts
        promptValidationService.ts
        rbac-alert-policy.json
        yahooFinanceService.ts
        backtest/
            runFullMultiYearBacktest.ts
            reports/
                v3.3-full-run-report.md
                v4.1-audit-report.md
                v4.2-definitive-audit-report.md
                v4.3-true-portfolio-simulation.md
                v4.4-net-expectancy-and-smart-sort.md
                v4.5-dynamic-atr-and-profitability.md
                v5.0-comprehensive-portfolio-run.md
                v5.0-profitability-algorithms-and-formulas.md
                v5.1-quant-architect-validation-report.md
                v6.0-20-asset-global-portfolio-report.md
                v6.0-comprehensive-architecture-and-results.md
                v6.1-quant-validation.md
                v6.2-quant-validation.md
                v6.3-final-report.md
                v6.4-final-report.md
                v6.5-final-report.md
                v6.5-reproduction-run.md
                v7.0-audit-completion-report.md
        config/
            apiAccess.ts
            constants.ts
            dataIntegrityConfig.ts
        routes/
            adminIntegrityRouter.ts
            adminRouter.ts
            advancedFeaturesRouter.ts
            ipoRouter.ts
            macroRouter.ts
            stockDetailRouter.ts
            subscriptionRouter.ts
        services/
            adminConfigService.ts
            aiSignalInterpreter.ts
            apiQuotaService.ts
            auditService.ts
            cacheService.ts
            currencyService.ts
            dataIntegrityService.ts
            dbIntegrationService.ts
            firebaseAdminService.ts
            healthMonitor.ts
            ipoDataService.ts
            notificationService.ts
            rateLimiter.ts
            schedulerService.ts
            serverLocalDatabase.ts
            subscriptionService.ts
        data/
            bistUniverse.ts
            cryptoAndCommodities.ts
            etfUniverse.ts
            usUniverse.ts
            local_db/
                adminConfig.json
                auditLogs.json
                data_integrity_audit.json
                economic_indicators.json
                ipoListings.json
                users.json
        signalEngine/
            backtestEngine.ts
            config.ts
            divergence.ts
            driftMonitor.ts
            engine.ts
            ensemble.ts
            index.ts
            indicators.ts
            kapParser.ts
            newsTracker.ts
            persistence.ts
            positionSizer.ts
            regime.ts
            riskManager.ts
            technicalCalculation.ts
            technicalParameters.ts
            testRunner.ts
            tradeTracker.ts
            types.ts
        validation/
            validateAnalysisOutput.ts
        intelligence/
            assetClassifier.ts
            baseAgent.ts
            intelligenceRouter.ts
            newsAgent.ts
            orchestratorAgent.ts
            scheduledDigest.ts
            sentimentAgent.ts
            technicalAgent.ts
            telegramBot.ts
            telegramService.ts
            types.ts
        middlewares/
            authMiddleware.ts
            requireAdmin.ts
            subscriptionGuard.ts
        indicator_fetchers/
            BaseFetcher.ts
            EcbFetcher.ts
            FrankfurterFetcher.ts
            FredFetcher.ts
            MacroDataAggregatorService.ts
            TcmbEvdsFetcher.ts
            TuikMacroFetcher.ts
            YahooFinanceMacroFetcher.ts
            impactSeedData.ts
            timeSeriesService.ts
            types.ts
        portfolio/
            portfolioAI.ts
            portfolioBacktest.ts
            portfolioRisk.ts
            portfolioRouter.ts
            portfolioService.ts
            portfolioTypes.ts
            twrService.ts
        migrations/
            migrateIpoDeepAnalysis.ts
        utils/
            nlpUtils.ts
            paywallMasker.ts
            securityErrors.ts
    public/
        manifest.json
        icons/
            icon-192.png
            icon-512.png
            icon-maskable-512.png
            icon.svg
    scripts/
        generate-icons.js
        generateAllUniverses.cjs
        generateBist.js
        generateUs500.cjs
        runProtocolAudit.ts
        testTechnicalParamsAndAi.ts
    app/
        applet/
            FAZ5_SECURITY_PROOF.md
            FAZ6_MODUL3_CONFIRMED.md
            FAZ6_MODUL3_EXACT_EVIDENCE.md
            FAZ6_MODUL3_REPORT.md
            FAZ6_MODUL4_EVIDENCE.md
            FAZ6_MODUL4_REPORT.md
    assets/
        .aistudio/
            .gitignore
```

## 3. Dosya Bazında Açıklamalı Döküm

### app dizini
| Dosya Yolu | Satır Sayısı | Açıklama |
|---|---|---|
| `./app/applet/FAZ5_SECURITY_PROOF.md` |  72 | Proje dokümantasyonu veya analiz raporu. |
| `./app/applet/FAZ6_MODUL3_CONFIRMED.md` |  31 | Proje dokümantasyonu veya analiz raporu. |
| `./app/applet/FAZ6_MODUL3_EXACT_EVIDENCE.md` |  66 | Proje dokümantasyonu veya analiz raporu. |
| `./app/applet/FAZ6_MODUL3_REPORT.md` |  113 | Proje dokümantasyonu veya analiz raporu. |
| `./app/applet/FAZ6_MODUL4_EVIDENCE.md` |  180 | Proje dokümantasyonu veya analiz raporu. |
| `./app/applet/FAZ6_MODUL4_REPORT.md` |  34 | Proje dokümantasyonu veya analiz raporu. |

### assetler
| Dosya Yolu | Satır Sayısı | Açıklama |
|---|---|---|
| `./assets/.aistudio/.gitignore` |  1 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |

### backend (server/)
| Dosya Yolu | Satır Sayısı | Açıklama |
|---|---|---|
| `./server.ts` |  1672 | Uygulamanın ana Express sunucu giriş noktası. |
| `./server/POST_DEPLOY_CHECKLIST.md` |  43 | Proje dokümantasyonu veya analiz raporu. |
| `./server/README_DEPLOYMENT.md` |  54 | Proje dokümantasyonu veya analiz raporu. |
| `./server/aiService.ts` |  350 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/backtest/reports/v3.3-full-run-report.md` |  208 | Sistem veya modül test scripti. |
| `./server/backtest/reports/v4.1-audit-report.md` |  219 | Sistem veya modül test scripti. |
| `./server/backtest/reports/v4.2-definitive-audit-report.md` |  340 | Sistem veya modül test scripti. |
| `./server/backtest/reports/v4.3-true-portfolio-simulation.md` |  82 | Sistem veya modül test scripti. |
| `./server/backtest/reports/v4.4-net-expectancy-and-smart-sort.md` |  74 | Sistem veya modül test scripti. |
| `./server/backtest/reports/v4.5-dynamic-atr-and-profitability.md` |  52 | Sistem veya modül test scripti. |
| `./server/backtest/reports/v5.0-comprehensive-portfolio-run.md` |  14 | Sistem veya modül test scripti. |
| `./server/backtest/reports/v5.0-profitability-algorithms-and-formulas.md` |  64 | Sistem veya modül test scripti. |
| `./server/backtest/reports/v5.1-quant-architect-validation-report.md` |  150 | Sistem veya modül test scripti. |
| `./server/backtest/reports/v6.0-20-asset-global-portfolio-report.md` |  21 | Sistem veya modül test scripti. |
| `./server/backtest/reports/v6.0-comprehensive-architecture-and-results.md` |  99 | Sistem veya modül test scripti. |
| `./server/backtest/reports/v6.1-quant-validation.md` |  42 | Sistem veya modül test scripti. |
| `./server/backtest/reports/v6.2-quant-validation.md` |  38 | Sistem veya modül test scripti. |
| `./server/backtest/reports/v6.3-final-report.md` |  816 | Sistem veya modül test scripti. |
| `./server/backtest/reports/v6.4-final-report.md` |  361 | Sistem veya modül test scripti. |
| `./server/backtest/reports/v6.5-final-report.md` |  220 | Sistem veya modül test scripti. |
| `./server/backtest/reports/v6.5-reproduction-run.md` |  12 | Sistem veya modül test scripti. |
| `./server/backtest/reports/v7.0-audit-completion-report.md` |  104 | Sistem veya modül test scripti. |
| `./server/backtest/runFullMultiYearBacktest.ts` |  290 | Sistem veya modül test scripti. |
| `./server/backtestService.ts` |  335 | Sistem veya modül test scripti. |
| `./server/config/apiAccess.ts` |  130 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/config/constants.ts` |  84 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/config/dataIntegrityConfig.ts` |  26 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/data/bistUniverse.ts` |  4144 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/data/cryptoAndCommodities.ts` |  1778 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/data/etfUniverse.ts` |  248 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/data/local_db/adminConfig.json` |  308 | Yapılandırma dosyası (config/manifest). |
| `./server/data/local_db/auditLogs.json` |  972 | Yapılandırma dosyası (config/manifest). |
| `./server/data/local_db/data_integrity_audit.json` |  2312 | Yapılandırma dosyası (config/manifest). |
| `./server/data/local_db/economic_indicators.json` |  522 | Yapılandırma dosyası (config/manifest). |
| `./server/data/local_db/ipoListings.json` |  950 | Yapılandırma dosyası (config/manifest). |
| `./server/data/local_db/users.json` |  6 | Yapılandırma dosyası (config/manifest). |
| `./server/data/usUniverse.ts` |  5314 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/indicator_fetchers/BaseFetcher.ts` |  7 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/indicator_fetchers/EcbFetcher.ts` |  59 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/indicator_fetchers/FrankfurterFetcher.ts` |  103 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/indicator_fetchers/FredFetcher.ts` |  135 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/indicator_fetchers/MacroDataAggregatorService.ts` |  102 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/indicator_fetchers/TcmbEvdsFetcher.ts` |  140 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/indicator_fetchers/TuikMacroFetcher.ts` |  59 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/indicator_fetchers/YahooFinanceMacroFetcher.ts` |  77 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/indicator_fetchers/impactSeedData.ts` |  252 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/indicator_fetchers/timeSeriesService.ts` |  431 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/indicator_fetchers/types.ts` |  116 | Uygulama geneli TypeScript tip tanımlamaları. |
| `./server/intelligence/assetClassifier.ts` |  119 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/intelligence/baseAgent.ts` |  53 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/intelligence/intelligenceRouter.ts` |  198 | Express API route/endpoint tanımları. |
| `./server/intelligence/newsAgent.ts` |  244 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/intelligence/orchestratorAgent.ts` |  351 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/intelligence/scheduledDigest.ts` |  103 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/intelligence/sentimentAgent.ts` |  253 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/intelligence/technicalAgent.ts` |  342 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/intelligence/telegramBot.ts` |  171 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/intelligence/telegramService.ts` |  298 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/intelligence/types.ts` |  101 | Uygulama geneli TypeScript tip tanımlamaları. |
| `./server/macroCommentaryService.ts` |  342 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/middlewares/authMiddleware.ts` |  104 | Express API route/endpoint tanımları. |
| `./server/middlewares/requireAdmin.ts` |  50 | Express API route/endpoint tanımları. |
| `./server/middlewares/subscriptionGuard.ts` |  214 | Express API route/endpoint tanımları. |
| `./server/migrations/migrateIpoDeepAnalysis.ts` |  98 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/portfolio/portfolioAI.ts` |  180 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/portfolio/portfolioBacktest.ts` |  319 | Sistem veya modül test scripti. |
| `./server/portfolio/portfolioRisk.ts` |  314 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/portfolio/portfolioRouter.ts` |  372 | Express API route/endpoint tanımları. |
| `./server/portfolio/portfolioService.ts` |  491 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/portfolio/portfolioTypes.ts` |  197 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/portfolio/twrService.ts` |  374 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/promptValidationService.ts` |  789 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/rbac-alert-policy.json` |  21 | Yapılandırma dosyası (config/manifest). |
| `./server/routes/adminIntegrityRouter.ts` |  70 | Express API route/endpoint tanımları. |
| `./server/routes/adminRouter.ts` |  635 | Express API route/endpoint tanımları. |
| `./server/routes/advancedFeaturesRouter.ts` |  773 | Express API route/endpoint tanımları. |
| `./server/routes/ipoRouter.ts` |  139 | Express API route/endpoint tanımları. |
| `./server/routes/macroRouter.ts` |  165 | Express API route/endpoint tanımları. |
| `./server/routes/stockDetailRouter.ts` |  747 | Express API route/endpoint tanımları. |
| `./server/routes/subscriptionRouter.ts` |  268 | Express API route/endpoint tanımları. |
| `./server/services/adminConfigService.ts` |  259 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/services/aiSignalInterpreter.ts` |  257 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/services/apiQuotaService.ts` |  260 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/services/auditService.ts` |  350 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/services/cacheService.ts` |  150 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/services/currencyService.ts` |  110 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/services/dataIntegrityService.ts` |  178 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/services/dbIntegrationService.ts` |  484 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/services/firebaseAdminService.ts` |  96 | Veritabanı işlemleri veya konfigürasyonu. |
| `./server/services/healthMonitor.ts` |  166 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/services/ipoDataService.ts` |  1115 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/services/notificationService.ts` |  162 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/services/rateLimiter.ts` |  125 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/services/schedulerService.ts` |  147 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/services/serverLocalDatabase.ts` |  204 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/services/subscriptionService.ts` |  289 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/signalEngine/backtestEngine.ts` |  608 | Sistem veya modül test scripti. |
| `./server/signalEngine/config.ts` |  76 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/signalEngine/divergence.ts` |  133 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/signalEngine/driftMonitor.ts` |  164 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/signalEngine/engine.ts` |  219 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/signalEngine/ensemble.ts` |  46 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/signalEngine/index.ts` |  25 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/signalEngine/indicators.ts` |  437 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/signalEngine/kapParser.ts` |  106 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/signalEngine/newsTracker.ts` |  143 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/signalEngine/persistence.ts` |  78 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/signalEngine/positionSizer.ts` |  66 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/signalEngine/regime.ts` |  176 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/signalEngine/riskManager.ts` |  110 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/signalEngine/technicalCalculation.ts` |  315 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/signalEngine/technicalParameters.ts` |  221 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/signalEngine/testRunner.ts` |  87 | Sistem veya modül test scripti. |
| `./server/signalEngine/tradeTracker.ts` |  78 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/signalEngine/types.ts` |  200 | Uygulama geneli TypeScript tip tanımlamaları. |
| `./server/utils/nlpUtils.ts` |  191 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/utils/paywallMasker.ts` |  98 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/utils/securityErrors.ts` |  15 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/validation/validateAnalysisOutput.ts` |  153 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server/yahooFinanceService.ts` |  919 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server_logs.txt` |  0 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./server_logs2.txt` |  68 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |

### frontend (src/)
| Dosya Yolu | Satır Sayısı | Açıklama |
|---|---|---|
| `./src/App.tsx` |  723 | Ana React uygulama rotası/layout'u. |
| `./src/components/AIChatAdvisor.tsx` |  348 | React UI bileşeni / arayüz modülü. |
| `./src/components/AIModelSettingsModal.tsx` |  485 | React UI bileşeni / arayüz modülü. |
| `./src/components/AcademyTooltip.tsx` |  324 | React UI bileşeni / arayüz modülü. |
| `./src/components/AdminPanel.tsx` |  442 | React UI bileşeni / arayüz modülü. |
| `./src/components/AdminSettingsSection.tsx` |  213 | React UI bileşeni / arayüz modülü. |
| `./src/components/AdvancedScreenerSection.tsx` |  521 | React UI bileşeni / arayüz modülü. |
| `./src/components/AuthScreen.tsx` |  440 | React UI bileşeni / arayüz modülü. |
| `./src/components/BacktestSection.tsx` |  713 | React UI bileşeni / arayüz modülü. |
| `./src/components/EconomicIndicators/AssetImpactSection.tsx` |  169 | React UI bileşeni / arayüz modülü. |
| `./src/components/EconomicIndicators/EconomicIndicatorsPage.tsx` |  527 | React UI bileşeni / arayüz modülü. |
| `./src/components/EconomicIndicators/MacroChartsSection.tsx` |  190 | React UI bileşeni / arayüz modülü. |
| `./src/components/EconomicIndicators/MultiIndicatorChartCard.tsx` |  452 | React UI bileşeni / arayüz modülü. |
| `./src/components/ErrorBoundary.tsx` |  116 | React UI bileşeni / arayüz modülü. |
| `./src/components/FinancialAcademySection.tsx` |  396 | React UI bileşeni / arayüz modülü. |
| `./src/components/Header.tsx` |  409 | React UI bileşeni / arayüz modülü. |
| `./src/components/IPOTracker.tsx` |  1361 | React UI bileşeni / arayüz modülü. |
| `./src/components/IntelligenceHub/IntelligenceHeader.tsx` |  133 | React UI bileşeni / arayüz modülü. |
| `./src/components/IntelligenceHub/IntelligenceHub.tsx` |  240 | React UI bileşeni / arayüz modülü. |
| `./src/components/IntelligenceHub/IntelligenceSearchBar.tsx` |  101 | React UI bileşeni / arayüz modülü. |
| `./src/components/IntelligenceHub/NewsFeedPanel.tsx` |  205 | React UI bileşeni / arayüz modülü. |
| `./src/components/IntelligenceHub/OrchestratorSummaryPanel.tsx` |  193 | React UI bileşeni / arayüz modülü. |
| `./src/components/IntelligenceHub/SentimentPanel.tsx` |  207 | React UI bileşeni / arayüz modülü. |
| `./src/components/IntelligenceHub/SourceHealthBanner.tsx` |  216 | React UI bileşeni / arayüz modülü. |
| `./src/components/IntelligenceHub/TechnicalPanel.tsx` |  183 | React UI bileşeni / arayüz modülü. |
| `./src/components/IntelligenceHub/TelegramStatusPanel.tsx` |  121 | React UI bileşeni / arayüz modülü. |
| `./src/components/LatestBalanceSheetsSection.tsx` |  322 | React UI bileşeni / arayüz modülü. |
| `./src/components/MarketNewsSection.tsx` |  706 | React UI bileşeni / arayüz modülü. |
| `./src/components/MarketOverview.tsx` |  567 | React UI bileşeni / arayüz modülü. |
| `./src/components/MarketTickerBar.tsx` |  124 | React UI bileşeni / arayüz modülü. |
| `./src/components/OfflineIndicator.tsx` |  53 | React UI bileşeni / arayüz modülü. |
| `./src/components/OpportunityScanner.tsx` |  523 | React UI bileşeni / arayüz modülü. |
| `./src/components/PWAInstallPrompt.tsx` |  228 | React UI bileşeni / arayüz modülü. |
| `./src/components/SettingsSection.tsx` |  672 | React UI bileşeni / arayüz modülü. |
| `./src/components/Sidebar.tsx` |  496 | React UI bileşeni / arayüz modülü. |
| `./src/components/SignalEngineV2Modal.tsx` |  474 | React UI bileşeni / arayüz modülü. |
| `./src/components/StockAnalysis/CompanyThesisTab.tsx` |  226 | React UI bileşeni / arayüz modülü. |
| `./src/components/StockAnalysis/CorporateEventsTab.tsx` |  157 | React UI bileşeni / arayüz modülü. |
| `./src/components/StockAnalysis/FinancialStatementsTab.tsx` |  311 | React UI bileşeni / arayüz modülü. |
| `./src/components/StockAnalysis/FundPositionsTab.tsx` |  317 | React UI bileşeni / arayüz modülü. |
| `./src/components/StockAnalysis/FundamentalValuationTab.tsx` |  147 | React UI bileşeni / arayüz modülü. |
| `./src/components/StockAnalysis/InteractiveStockPriceChart.tsx` |  547 | React UI bileşeni / arayüz modülü. |
| `./src/components/StockAnalysis/MultiplesAnalysisTab.tsx` |  221 | React UI bileşeni / arayüz modülü. |
| `./src/components/StockAnalysis/PeerComparisonTab.tsx` |  336 | React UI bileşeni / arayüz modülü. |
| `./src/components/StockAnalysis/ScorecardTab.tsx` |  344 | React UI bileşeni / arayüz modülü. |
| `./src/components/StockAnalysis/SeasonalityTab.tsx` |  198 | React UI bileşeni / arayüz modülü. |
| `./src/components/StockAnalysis/StockBrokerageDistribution.tsx` |  197 | React UI bileşeni / arayüz modülü. |
| `./src/components/StockAnalysis/SubsidiariesAndGovernanceTab.tsx` |  258 | React UI bileşeni / arayüz modülü. |
| `./src/components/StockAnalysis/TechnicalEngineTab.tsx` |  950 | React UI bileşeni / arayüz modülü. |
| `./src/components/StockAnalysis/WhatIfValuationSimulator.tsx` |  275 | React UI bileşeni / arayüz modülü. |
| `./src/components/StockAnalysisModal.tsx` |  1355 | React UI bileşeni / arayüz modülü. |
| `./src/components/Subscription/FeatureLockOverlay.tsx` |  95 | React UI bileşeni / arayüz modülü. |
| `./src/components/Subscription/PricingSection.tsx` |  414 | React UI bileşeni / arayüz modülü. |
| `./src/components/Subscription/UpgradeModal.tsx` |  116 | React UI bileşeni / arayüz modülü. |
| `./src/components/TefasAiRadarModal.tsx` |  110 | React UI bileşeni / arayüz modülü. |
| `./src/components/TefasAnalysis/TefasFundAumTrend.tsx` |  161 | React UI bileşeni / arayüz modülü. |
| `./src/components/TefasAnalysis/TefasFundComparisonChart.tsx` |  358 | React UI bileşeni / arayüz modülü. |
| `./src/components/TefasAnalysis/TefasFundOperationalInfo.tsx` |  110 | React UI bileşeni / arayüz modülü. |
| `./src/components/TefasAnalysis/TefasFundPeerComparison.tsx` |  181 | React UI bileşeni / arayüz modülü. |
| `./src/components/TefasAnalysis/TefasFundRiskMetrics.tsx` |  174 | React UI bileşeni / arayüz modülü. |
| `./src/components/TefasFundDetailModal.tsx` |  478 | React UI bileşeni / arayüz modülü. |
| `./src/components/TefasFundsSection.tsx` |  590 | React UI bileşeni / arayüz modülü. |
| `./src/components/WatchlistManager.tsx` |  269 | React UI bileşeni / arayüz modülü. |
| `./src/components/admin/AdminAiSettingsTab.tsx` |  383 | React UI bileşeni / arayüz modülü. |
| `./src/components/admin/AdminApiManagementTab.tsx` |  244 | React UI bileşeni / arayüz modülü. |
| `./src/components/admin/AdminAuditLogsTab.tsx` |  242 | React UI bileşeni / arayüz modülü. |
| `./src/components/admin/AdminDatabaseIntegrationTab.tsx` |  966 | React UI bileşeni / arayüz modülü. |
| `./src/components/admin/AdminErrorLogsTab.tsx` |  214 | React UI bileşeni / arayüz modülü. |
| `./src/components/admin/AdminIpoManagementTab.tsx` |  683 | React UI bileşeni / arayüz modülü. |
| `./src/components/admin/AdminOverviewTab.tsx` |  256 | React UI bileşeni / arayüz modülü. |
| `./src/components/admin/AdminPlatformTab.tsx` |  185 | React UI bileşeni / arayüz modülü. |
| `./src/components/admin/AdminSubscriptionTuningTab.tsx` |  710 | React UI bileşeni / arayüz modülü. |
| `./src/components/admin/AdminUserManagementTab.tsx` |  802 | React UI bileşeni / arayüz modülü. |
| `./src/components/ui/LockedField.tsx` |  89 | React UI bileşeni / arayüz modülü. |
| `./src/components/ui/ValidationBadge.tsx` |  64 | React UI bileşeni / arayüz modülü. |
| `./src/config/paywallConfig.ts` |  8 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./src/contexts/AdminConfigContext.tsx` |  48 | React UI bileşeni / arayüz modülü. |
| `./src/contexts/AuthContext.tsx` |  257 | React UI bileşeni / arayüz modülü. |
| `./src/data/defaultQuotesData.ts` |  476 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./src/data/newsData.ts` |  410 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./src/data/tefasFundsData.ts` |  875 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./src/hooks/useSubscription.ts` |  147 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./src/index.css` |  59 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./src/lib/firebase.ts` |  4 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./src/main.tsx` |  24 | React uygulamasının ana DOM bağlama noktası. |
| `./src/pages/Portfolio/components/AIRecommendations.tsx` |  174 | React UI bileşeni / arayüz modülü. |
| `./src/pages/Portfolio/components/AddHoldingModal.tsx` |  241 | React UI bileşeni / arayüz modülü. |
| `./src/pages/Portfolio/components/BacktestPanel.tsx` |  369 | React UI bileşeni / arayüz modülü. |
| `./src/pages/Portfolio/components/CreatePortfolioModal.tsx` |  159 | React UI bileşeni / arayüz modülü. |
| `./src/pages/Portfolio/components/HoldingsTable.tsx` |  309 | React UI bileşeni / arayüz modülü. |
| `./src/pages/Portfolio/components/PortfolioChart.tsx` |  651 | React UI bileşeni / arayüz modülü. |
| `./src/pages/Portfolio/components/PortfolioSummary.tsx` |  201 | React UI bileşeni / arayüz modülü. |
| `./src/pages/Portfolio/components/RiskPanel.tsx` |  204 | React UI bileşeni / arayüz modülü. |
| `./src/pages/Portfolio/components/TelegramAlertsModal.tsx` |  176 | React UI bileşeni / arayüz modülü. |
| `./src/pages/Portfolio/hooks/usePortfolio.ts` |  351 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./src/pages/Portfolio/hooks/usePortfolioAI.ts` |  42 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./src/pages/Portfolio/hooks/usePortfolioBacktest.ts` |  46 | Sistem veya modül test scripti. |
| `./src/pages/Portfolio/index.tsx` |  296 | React UI bileşeni / arayüz modülü. |
| `./src/services/firebaseClient.ts` |  93 | Veritabanı işlemleri veya konfigürasyonu. |
| `./src/services/localDatabaseService.ts` |  106 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./src/services/oracleDatabaseService.ts` |  116 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./src/shared/subscriptionPlans.ts` |  269 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./src/types.ts` |  1599 | Uygulama geneli TypeScript tip tanımlamaları. |
| `./src/utils/apiClient.ts` |  124 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./src/utils/clientErrorLogger.ts` |  153 | Veritabanı işlemleri veya konfigürasyonu. |
| `./src/utils/exportUtils.ts` |  49 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./src/utils/ipoAnalysisUtils.ts` |  211 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |

### kök dizin (diğer)
| Dosya Yolu | Satır Sayısı | Açıklama |
|---|---|---|
| `./.env.example` |  18 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./.gitignore` |  8 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./add_tefas_radar.sh` |  46 | Bash otomasyon veya test scripti. |
| `./bootstrap_roles.cjs` |  26 | Veritabanı işlemleri veya konfigürasyonu. |
| `./bootstrap_roles.ts` |  25 | Veritabanı işlemleri veya konfigürasyonu. |
| `./firebase-applet-config.json` |  12 | Yapılandırma dosyası (config/manifest). |
| `./firebase-blueprint.json` |  166 | Yapılandırma dosyası (config/manifest). |
| `./firestore.rules` |  102 | Veritabanı işlemleri veya konfigürasyonu. |
| `./get-errors.ts` |  6 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./get_atr.ts` |  42 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./index.html` |  44 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./metadata.json` |  6 | Yapılandırma dosyası (config/manifest). |
| `./mod3-leak-results.txt` |  18 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./mod3-results.txt` |  15 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./package.json` |  60 | Yapılandırma dosyası (config/manifest). |
| `./package.json.new` |  0 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./rewrite_academy.cjs` |  382 | React UI bileşeni / arayüz modülü. |
| `./seed-admin.ts` |  57 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./tsconfig.json` |  26 | Yapılandırma dosyası (config/manifest). |
| `./update_academy_section.cjs` |  35 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./update_app_academy_nav.cjs` |  0 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./update_readme.cjs` |  44 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./vite.config.ts` |  115 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./wait_for_build.sh` |  8 | Bash otomasyon veya test scripti. |
| `./wait_for_pup.sh` |  8 | Bash otomasyon veya test scripti. |

### kök dizin (dokümantasyon)
| Dosya Yolu | Satır Sayısı | Açıklama |
|---|---|---|
| `./FAZ5_PRODUCTION_REPORT.md` |  83 | Proje dokümantasyonu veya analiz raporu. |
| `./FAZ5_SECURITY_PROOF.md` |  72 | Proje dokümantasyonu veya analiz raporu. |
| `./FAZ6_MODUL2_REPORT.md` |  21 | Proje dokümantasyonu veya analiz raporu. |
| `./MARKETPULSE_AI_TECHNICAL_SPECIFICATION_AND_SYSTEM_REPORT.md` |  313 | Proje dokümantasyonu veya analiz raporu. |
| `./PROGRESS.md` |  39 | Proje dokümantasyonu veya analiz raporu. |
| `./RAPOR.md` |  174 | Proje dokümantasyonu veya analiz raporu. |
| `./RAPOR_SINYAL_VE_AI_YORUMLAMA.md` |  209 | Proje dokümantasyonu veya analiz raporu. |
| `./README_Data_Integrity.md` |  22 | Proje dokümantasyonu veya analiz raporu. |
| `./SIGNAL_ENGINE_V2_TEST_REPORT.md` |  92 | Proje dokümantasyonu veya analiz raporu. |

### kök dizin (test scriptleri)
| Dosya Yolu | Satır Sayısı | Açıklama |
|---|---|---|
| `./run_v6.1_backtest.ts` |  319 | Sistem veya modül test scripti. |
| `./run_v6.3_backtest.ts` |  416 | Sistem veya modül test scripti. |
| `./run_v6.4_backtest.ts` |  442 | Sistem veya modül test scripti. |
| `./run_v6.5_backtest.ts` |  673 | Sistem veya modül test scripti. |
| `./test-admin-auth.ts` |  18 | Sistem veya modül test scripti. |
| `./test-admin-db.ts` |  15 | Sistem veya modül test scripti. |
| `./test-admin-perm.ts` |  32 | Sistem veya modül test scripti. |
| `./test-admin-raw.ts` |  20 | Sistem veya modül test scripti. |
| `./test-admin-read.ts` |  15 | Veritabanı işlemleri veya konfigürasyonu. |
| `./test-admin-real.sh` |  29 | Sistem veya modül test scripti. |
| `./test-admin-rules.sh` |  30 | Sistem veya modül test scripti. |
| `./test-admin-rules2.sh` |  26 | Sistem veya modül test scripti. |
| `./test-admin-services.ts` |  21 | Sistem veya modül test scripti. |
| `./test-auth-rules.js` |  83 | Veritabanı işlemleri veya konfigürasyonu. |
| `./test-client.cjs` |  21 | Sistem veya modül test scripti. |
| `./test-concurrency.ts` |  43 | Sistem veya modül test scripti. |
| `./test-critical-path.ts` |  31 | Sistem veya modül test scripti. |
| `./test-e2e-integrity.ts` |  77 | Express API route/endpoint tanımları. |
| `./test-errors.ts` |  6 | Sistem veya modül test scripti. |
| `./test-escalation.sh` |  21 | Sistem veya modül test scripti. |
| `./test-escalation3.sh` |  21 | Sistem veya modül test scripti. |
| `./test-fetch.js` |  1 | Sistem veya modül test scripti. |
| `./test-firestore-rules.js` |  62 | Veritabanı işlemleri veya konfigürasyonu. |
| `./test-html.cjs` |  30 | Sistem veya modül test scripti. |
| `./test-html2.cjs` |  32 | Sistem veya modül test scripti. |
| `./test-html3.cjs` |  15 | Sistem veya modül test scripti. |
| `./test-html4.cjs` |  1 | Sistem veya modül test scripti. |
| `./test-mint.js` |  11 | Sistem veya modül test scripti. |
| `./test-mod1-scenario-b.sh` |  13 | Veritabanı işlemleri veya konfigürasyonu. |
| `./test-mod1-scenarios.ts` |  48 | Sistem veya modül test scripti. |
| `./test-mod3-health-runner.ts` |  176 | Sistem veya modül test scripti. |
| `./test-mod3-loadtest.ts` |  52 | Sistem veya modül test scripti. |
| `./test-mod3-real.ts` |  39 | Sistem veya modül test scripti. |
| `./test-mod4-paywall.ts` |  57 | Sistem veya modül test scripti. |
| `./test-p-limit.js` |  17 | Sistem veya modül test scripti. |
| `./test-paywall.ts` |  22 | Sistem veya modül test scripti. |
| `./test-puppeteer.cjs` |  18 | Sistem veya modül test scripti. |
| `./test-rest-parse.ts` |  7 | Sistem veya modül test scripti. |
| `./test-rest.sh` |  37 | Sistem veya modül test scripti. |
| `./test-rest.ts` |  5 | Sistem veya modül test scripti. |
| `./test-stage1-migration.ts` |  43 | Sistem veya modül test scripti. |
| `./test-trick.cjs` |  28 | Sistem veya modül test scripti. |
| `./test-trick.ts` |  4 | Sistem veya modül test scripti. |
| `./test-tsx.cjs` |  27 | Sistem veya modül test scripti. |
| `./test-tsx.ts` |  3 | Sistem veya modül test scripti. |
| `./test-worker-health-monitor.ts` |  108 | Sistem veya modül test scripti. |
| `./test-yf.cjs` |  2 | Sistem veya modül test scripti. |
| `./test-yf2.cjs` |  3 | Sistem veya modül test scripti. |
| `./test-yf3.cjs` |  3 | Sistem veya modül test scripti. |
| `./test-yf4.cjs` |  2 | Sistem veya modül test scripti. |

### kök dizin (yama ve düzeltme scriptleri)
| Dosya Yolu | Satır Sayısı | Açıklama |
|---|---|---|
| `./fix_all.sh` |  4 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./fix_file.js` |  6 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./fix_final.sh` |  9 | React UI bileşeni / arayüz modülü. |
| `./fix_news_speed.js` |  4 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./fix_search.sh` |  5 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./fix_server.sh` |  12 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./fix_server2.sh` |  7 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./fix_server3.js` |  4 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./fix_sidebar.js` |  4 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./fix_tefas.js` |  5 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./fix_tefas.py` |  11 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./package.json.patch` |  3 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch-server.cjs` |  21 | Express API route/endpoint tanımları. |
| `./patch-service.cjs` |  10 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch.cjs` |  14 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch2.cjs` |  14 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch3.cjs` |  14 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_academy_topics.cjs` |  127 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_academy_topics.js` |  128 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_admin_audit.cjs` |  71 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_admin_auth.cjs` |  96 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_admin_import.cjs` |  9 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_admin_service.cjs` |  59 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_admin_settings.cjs` |  14 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_app.cjs` |  21 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_app2.cjs` |  11 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_app_admin.cjs` |  23 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_app_auth.cjs` |  13 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_app_hooks.cjs` |  24 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_app_modelconfig.cjs` |  44 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_app_persistence.cjs` |  20 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_app_radar.sh` |  6 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_app_settings.sh` |  16 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_app_tabs.cjs` |  19 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_app_watchlist_sync.cjs` |  42 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_auth_audit.cjs` |  14 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_auth_google.cjs` |  70 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_auth_hasperm.cjs` |  24 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_auth_middleware.cjs` |  81 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_auth_permissions.cjs` |  30 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_auth_portfolio.cjs` |  36 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_bot.cjs` |  71 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_chat2.cjs` |  73 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_chat_persistence.cjs` |  79 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_digest.cjs` |  18 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_error_log.cjs` |  29 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_errors.cjs` |  18 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_flags.cjs` |  12 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_header.cjs` |  14 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_header_search.sh` |  25 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_intel_telegram.cjs` |  31 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_layout.sh` |  2 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_main.cjs` |  12 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_main2.cjs` |  12 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_masker.cjs` |  16 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_modal_news.sh` |  16 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_news.sh` |  24 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_news_speed.sh` |  10 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_orchestrator.cjs` |  46 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_orchestrator2.cjs` |  41 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_paths.cjs` |  30 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_paths_fixed.cjs` |  17 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_plans.cjs` |  34 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_portfolio_router.cjs` |  48 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_prompt.sh` |  4 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_ratelimit.cjs` |  9 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_ratelimit2.cjs` |  9 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_routers.cjs` |  48 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_rules.cjs` |  22 | Veritabanı işlemleri veya konfigürasyonu. |
| `./patch_rules_v2.cjs` |  53 | Veritabanı işlemleri veya konfigürasyonu. |
| `./patch_scanner.sh` |  3 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_server.cjs` |  34 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_server.sh` |  9 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_server_auth.cjs` |  9 | Express API route/endpoint tanımları. |
| `./patch_server_cron.cjs` |  18 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_server_opportunities.sh` |  13 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_server_rbac.cjs` |  19 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_server_search.sh` |  17 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_server_security.cjs` |  31 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_server_telegram.cjs` |  58 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_settings_tab.cjs` |  86 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_settings_ui.cjs` |  35 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_sidebar.sh` |  9 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_sidebar_admin_tab.cjs` |  19 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_sidebar_fix.cjs` |  14 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_sidebar_hasperm.cjs` |  35 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_sidebar_imports.cjs` |  18 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_sidebar_props.cjs` |  14 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_sidebar_rbac.cjs` |  34 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_sidebar_shield.cjs` |  9 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_sidebar_tabitem.cjs` |  14 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_sidebar_types.cjs` |  14 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_sub_service.cjs` |  152 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_tefas_funds.sh` |  29 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_tele.cjs` |  43 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_tele.js` |  30 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_telegram.cjs` |  47 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_temperature.sh` |  2 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_useportfolio.cjs` |  252 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_useportfolio2.cjs` |  9 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_vite_pwa.cjs` |  14 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_yahoo.cjs` |  82 | Sistem üzerinde yama veya düzeltme yapan script. |
| `./patch_yahoo_log.cjs` |  8 | Sistem üzerinde yama veya düzeltme yapan script. |

### public varlıklar
| Dosya Yolu | Satır Sayısı | Açıklama |
|---|---|---|
| `./public/icons/icon.svg` |  17 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./public/manifest.json` |  31 | Yapılandırma dosyası (config/manifest). |

### scriptler (scripts/)
| Dosya Yolu | Satır Sayısı | Açıklama |
|---|---|---|
| `./scripts/generate-icons.js` |  129 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./scripts/generateAllUniverses.cjs` |  714 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./scripts/generateBist.js` |  442 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./scripts/generateUs500.cjs` |  575 | Yardımcı modül veya iş mantığı (içerik kısmen incelendi). |
| `./scripts/runProtocolAudit.ts` |  147 | Express API route/endpoint tanımları. |
| `./scripts/testTechnicalParamsAndAi.ts` |  125 | Sistem veya modül test scripti. |

## 4. Doğrulama Notu
- **Sayı Eşleşmesi:** Hariç tutulan 44,243 dosya + analiz edilen 436 kaynak dosya = 44,679 (Toplam Dosya).
- **Rastgele Doğrulama:** `src/main.tsx`, `server.ts`, `index.html` gibi dosyalar `cat` ile manuel açılarak içerikleri teyit edildi.
- **Hiyerarşi Kontrolü:** `find` ile üretilen yapı, liste ve döküm hiyerarşisi ile birebir eşleşmektedir.

## 5. Belirsizlikler
Aşağıdaki dosyaların ne amaçla kullanıldığı içerik okumasına rağmen tamamen netleşmemiştir:
- `patch_*` dosyalarının tam olarak hangi geçmiş sorunları çözdüğü (yamalar bağımsız çalıştırıldığı için geçmiş bağlamları eksik).
- `test-html*.cjs` gibi betiklerin hangi DOM yapısını test etmek için yazıldığı.
