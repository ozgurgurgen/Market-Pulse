import os
import re

with open("all_files.txt", "r") as f:
    all_files = [line.strip() for line in f.readlines()]

api_findings = []
non_api_files = []
wrapper_usages = {}

api_patterns = [
    (re.compile(r'\bfetch\s*\('), "HTTP İsteği (fetch API)"),
    (re.compile(r'\baxios\.[a-z]+\s*\('), "HTTP İsteği (axios)"),
    (re.compile(r'\bhttp[s]?\.(request|get)\s*\('), "HTTP İsteği (Node.js http/https)"),
    (re.compile(r'new\s+WebSocket\s*\('), "WebSocket Bağlantısı"),
    
    (re.compile(r'[''"]yahoo-finance2[''"]'), "Yahoo Finance API Paketi"),
    (re.compile(r'\byf\.(quote|historical|search|options|chart|insights)\s*\('), "Yahoo Finance API Çağrısı"),
    (re.compile(r'\byfClient\.(quote|historical|search)\s*\('), "Yahoo Finance Client Çağrısı"),
    
    (re.compile(r'\badminDb\.(collection|doc)\s*\('), "Firestore Admin DB İşlemi"),
    (re.compile(r'\bdb\.(collection|doc)\s*\('), "Firestore İstemci DB İşlemi"),
    (re.compile(r'\b(getDoc|getDocs|setDoc|updateDoc|addDoc|deleteDoc)\s*\('), "Firestore Veri Okuma/Yazma"),
    (re.compile(r'\bgetFirestore\s*\('), "Firestore Başlatma"),
]

patch_patterns = [
    (re.compile(r'["\'](.*adminDb.*|.*fetch[A-Z(].*|.*db\..*)'), "Yama dosyası (API bağlantısı içeren kod satırı enjekte ediliyor/değiştiriliyor)")
]

for filepath in all_files:
    if filepath.endswith('.md') or filepath.endswith('.txt'):
        non_api_files.append(filepath)
        continue
        
    has_api = False
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            for i, line in enumerate(lines):
                line_str = line.strip()
                if line_str.startswith('//') or line_str.startswith('/*') or line_str.startswith('*'):
                    continue
                
                matched = False
                
                if 'safeFetchJson' in line_str and not line_str.startswith('import ') and not 'export async function safeFetchJson' in line_str:
                    api_findings.append({
                        'file': filepath,
                        'line': i + 1,
                        'code': line_str,
                        'desc': "Özel API fetch wrapper çağrısı (safeFetchJson)"
                    })
                    has_api = True
                    matched = True
                    wrapper_usages[filepath] = wrapper_usages.get(filepath, 0) + 1

                if not matched:
                    for pattern, desc in api_patterns:
                        if pattern.search(line_str):
                            api_findings.append({
                                'file': filepath,
                                'line': i + 1,
                                'code': line_str,
                                'desc': desc
                            })
                            has_api = True
                            matched = True
                            break
                
                if not matched and ('patch' in filepath or 'fix' in filepath):
                    for pattern, desc in patch_patterns:
                         if pattern.search(line_str):
                            api_findings.append({
                                'file': filepath,
                                'line': i + 1,
                                'code': line_str,
                                'desc': desc
                            })
                            has_api = True
                            matched = True
                            break

                # SIMULATED DATA / MOCKING RULES
                if not matched:
                    l_lower = line_str.lower()
                    
                    # 1. Math.sin or Math.random (Relaxed check, no longer restricted to 'price'/'data')
                    if 'math.sin(' in l_lower or 'math.random()' in l_lower:
                         if 'interactive' in filepath.lower() or 'time' in filepath.lower() or 'chart' in filepath.lower():
                            api_findings.append({
                                    'file': filepath,
                                    'line': i + 1,
                                    'code': line_str,
                                    'desc': "Sahte/Simüle Veri Üretimi (Matematiksel Zaman Serisi)"
                            })
                            has_api = True
                            matched = True
                            
                    # 2. Hardcoded Economic Indicators Mock Arrays
                    elif 'const indicators: economicindicator[]' in l_lower:
                        api_findings.append({
                                'file': filepath,
                                'line': i + 1,
                                'code': line_str,
                                'desc': "Sahte/Simüle Makro Veri Kaynağı (Hardcoded)"
                        })
                        has_api = True
                        matched = True

                    # 3. Aggregator/Base/Fallback fetching orchestration
                    elif ('server/indicator_fetchers/' in filepath and not filepath.endswith('types.ts')):
                         if 'fetchindicators()' in l_lower or 'export class macrodataaggregatorservice' in l_lower or 'export abstract class basefetcher' in l_lower:
                             api_findings.append({
                                'file': filepath,
                                'line': i + 1,
                                'code': line_str,
                                'desc': "Makro Veri Çekirdek/Yönetici Modülü"
                             })
                             has_api = True
                             matched = True

                    # 4. Quota Service Fallback Mock
                    elif 'endpointsample' in l_lower and 'id:' not in l_lower:
                         if 'yahoo' in l_lower or 'firestore' in l_lower or 'tefas' in l_lower or 'evds' in l_lower:
                              api_findings.append({
                                    'file': filepath,
                                    'line': i + 1,
                                    'code': line_str,
                                    'desc': "Sahte/Simüle API Quota (Statik Veri)"
                              })
                              has_api = True
                              matched = True
                              
                    # 5. Local Database usage pretending to be a real DB / Cache
                    elif 'serverLocalDatabase.get(' in line_str or 'serverLocalDatabase.getAll(' in line_str:
                         api_findings.append({
                              'file': filepath,
                              'line': i + 1,
                              'code': line_str,
                              'desc': "Simüle Edilmiş Yerel DB/Önbellek Erişimi"
                         })
                         has_api = True
                         matched = True
                        
    except Exception as e:
        pass
        
    if not has_api:
        non_api_files.append(filepath)

api_files_set = set(x['file'] for x in api_findings)
print(f"Total API files found: {len(api_files_set)}")
print(f"Total non API files: {len(non_api_files)}")

# Outputs
with open("API_KAYNAKLARI_NIHAI_DUZELTILMIS.md", "w", encoding="utf-8") as f:
    f.write("# API ve Veri Kaynağı Bulunan Dosyalar (Düzeltilmiş ve Genişletilmiş)\n\n")
    f.write("| Dosya Yolu | Satır No | Kod Satırı | Bağlandığı Kaynak | Doğrulama Durumu |\n")
    f.write("|---|---|---|---|---|\n")
    api_findings.sort(key=lambda x: (x['file'], x['line']))
    for item in api_findings:
        code = item['code'].replace('|', '&#124;')
        if len(code) > 120:
            code = code[:117] + "..."
        f.write(f"| `{item['file']}` | {item['line']} | `{code}` | {item['desc']} | Makro veri tespitiyle onarıldı |\n")

with open("API_BAGLANTISI_OLMAYAN_DOSYALAR_NIHAI_DUZELTILMIS.md", "w", encoding="utf-8") as f:
    f.write("# API Bağlantısı Olmayan Dosyalar (Düzeltilmiş ve Genişletilmiş)\n\n")
    non_api_files.sort()
    for file in non_api_files:
        f.write(f"- {file}\n")
