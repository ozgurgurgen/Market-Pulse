const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsSection.tsx', 'utf8');

const tabContent = `
      {/* TAB: TELEGRAM & BİLDİRİMLER */}
      {settingsTab === 'telegram' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Radio className="text-blue-400" />
              Telegram Komuta Merkezi
            </h3>
            
            <div className="space-y-4">
              <p className="text-sm text-slate-400">
                Telegram botumuz sayesinde anlık piyasa alarmlarını cebinize alabilir, bot ile çift yönlü sohbet ederek hisse ve fon raporları isteyebilirsiniz.
              </p>
              
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-sm font-semibold text-slate-200">Hesabı Bağla</h4>
                
                {userData?.telegramChatId ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                      <CheckCircle2 size={18} />
                      Telegram hesabınız başarıyla bağlı!
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await fetch('/api/telegram/unlink', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ uid: user?.uid })
                          });
                          alert('Bağlantı kaldırıldı. Lütfen sayfayı yenileyin.');
                        } catch(e) {
                          alert('Hata oluştu');
                        }
                      }}
                      className="px-4 py-2 bg-rose-500/20 text-rose-400 rounded-lg text-xs font-bold hover:bg-rose-500/30 transition-colors"
                    >
                      Bağlantıyı Kaldır
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/telegram/link-token', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ uid: user?.uid })
                          });
                          const data = await res.json();
                          if (data.token) {
                            alert('Kodunuz: ' + data.token + '\\n\\nBunu Telegram botuna /start ' + data.token + ' yazarak gönderin.\\nBot Kullanıcı Adı: @' + data.botUsername);
                          }
                        } catch(e) {
                          alert('Kod oluşturulamadı.');
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-900/20"
                    >
                      Eşleştirme Kodu Üret
                    </button>
                    <p className="text-xs text-slate-500">
                      Butona basarak tek kullanımlık kodunuzu alın ve Telegram'dan bota gönderin.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  "{/* TAB 1: Veritabanı Entegrasyonları",
  tabContent + "\n      {/* TAB 1: Veritabanı Entegrasyonları"
);

fs.writeFileSync('src/components/SettingsSection.tsx', code);
console.log('patched settings UI content');
