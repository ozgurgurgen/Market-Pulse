#!/bin/bash
sed -i -e '/import { AIModelSettingsModal }/a \
import { SettingsSection } from "./components/SettingsSection";\
' src/App.tsx

sed -i -e '/{activeTab === '"'"'watchlist'"'"' && (/i \
        {activeTab === "settings" && (\
          <SettingsSection \
            modelConfig={modelConfig} \
            onSaveConfig={(newConfig) => {\
              setModelConfig(newConfig);\
              localStorage.setItem("marketpulse_aiconfig", JSON.stringify(newConfig));\
            }}\
          />\
        )}\
' src/App.tsx
