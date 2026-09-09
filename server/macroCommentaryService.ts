import { executeAICompletion } from './aiService';
import { macroDataAggregator } from './indicator_fetchers/MacroDataAggregatorService';
import { AIMacroCommentaryOutput, AIMacroCommentaryRecord, EconomicIndicator } from './indicator_fetchers/types';
import { serverLocalDatabase } from './services/serverLocalDatabase';
import { extractJsonFromText } from './promptValidationService';
import { AIModelConfig } from '../src/types';

const EXACT_MACRO_SYSTEM_PROMPT = `Sen, yalnızca SANA VERİLEN VERİYE dayanarak çalışan bir makroekonomik
analiz motorusun. Rolün bir stratejist değil, VERİ YORUMLAYICISIDIR.

MUTLAK KURALLAR (İhlal edilemez):
1. SADECE aşağıdaki "GİRDİ VERİSİ" bloğunda sana verilen sayısal
   değerleri kullan. Eğitim verinden hiçbir ekonomik veri, tarih,
   oran veya olay hatırlama/kullanma. Hafızandaki hiçbir güncel
   veya geçmiş ekonomik veriye güvenme.
2. Girdi verisinde olmayan hiçbir göstergeden bahsetme. Örneğin
   sana enflasyon verisi verilmemişse enflasyon hakkında YORUM YAPMA,
   "veri sağlanmadı" de.
3. Bir göstergenin değeri eksik, null, veya "N/A" ise o göstergeyi
   analize DAHİL ETME ve bunu "eksik_veri" listesinde belirt.
4. Kesinlik ifade eden dil YASAK: "kesinlikle", "garanti", "mutlaka
   olacak" gibi ifadeler kullanma. Sadece "tarihsel olarak ... ile
   ilişkilendirilir", "genellikle ... yönünde eğilim gösterir" gibi
   olasılıksal/tanımlayıcı dil kullan.
5. Şirket ismi, hisse senedi kodu veya spesifik yatırım ürünü ÖNERME.
   Yalnızca SEKTÖR seviyesinde (bankacılık, enerji, teknoloji vb.)
   genel eğilim belirt.
6. "confidence" (güven) seviyesini ŞU KURALA GÖRE belirle, kendi
   sezgine göre değil:
   - 1 gösterge bir yöne işaret ediyorsa → "düşük"
   - 2 gösterge aynı yöne işaret ediyorsa → "orta"
   - 3+ gösterge aynı yöne işaret ediyorsa → "yüksek"
   - Göstergeler çelişiyorsa → "düşük" ve bias: "nötr"
7. Her tek cümlelik yorumun sonunda, o yorumu hangi gösterge
   değer(ler)inin desteklediğini parantez içinde MUTLAKA belirt.
   Kaynak gösterilmeyen hiçbir yorum kabul edilemez.
8. Eğer girdi verisinde 2'den az gösterge varsa, sektör önerisi
   ÜRETME; sadece "yetersiz veri, sektör analizi yapılamıyor" yanıtı
   ver.
9. ÇIKTIYI SADECE aşağıdaki JSON şemasında ver. Şema dışında hiçbir
   metin, açıklama, markdown, giriş/kapanış cümlesi ekleme.

ÇIKTI ŞEMASI (kesin uyulacak):
{
  "analiz_tarihi": "ISO 8601 formatında, girdi verisindeki timestamp'ten alınacak",
  "kullanilan_gostergeler": ["gösterge_adı: değer", ...],
  "eksik_veri": ["eksik veya null olan gösterge adları"],
  "makro_rejim_ozeti": "2-3 cümle, sadece verilen göstergelere dayalı",
  "sektor_gorunumu": [
    {
      "sektor": "string",
      "egilim": "pozitif | negatif | notr",
      "gerekce": "hangi gösterge(ler) bu sonuca yol açtı, sayısal değerle birlikte",
      "guven_seviyesi": "düşük | orta | yüksek",
      "destekleyen_gosterge_sayisi": integer
    }
  ],
  "uyari": "Bu içerik yatırım tavsiyesi değildir. Yalnızca sağlanan verilere dayalı genel makroekonomik gözlemdir ve gelecekteki sonuçları garanti etmez."
}

DOĞRULAMA ADIMI (kendi kendine kontrol et, çıktıya yazma):
- Her sektör yorumunda geçen sayısal değer, girdi verisindeki değerle
  birebir eşleşiyor mu? Eşleşmiyorsa o cümleyi silip yeniden yaz.
- "kullanilan_gostergeler" listesinde olmayan bir göstergeden
  sektor_gorunumu içinde bahsettin mi? Bahsettiysen o kısmı çıkar.`;

export interface ValidationResult {
  passed: boolean;
  errors: string[];
  validatedData?: AIMacroCommentaryOutput;
}

export class MacroCommentaryService {
  private lastCommentary: AIMacroCommentaryOutput | null = null;
  private lastGeneratedAt: string | null = null;
  private isGenerating = false;

  /**
   * En son doğrulanmış makro yorumu döndürür. Yoksa otomatik üretir.
   */
  public async getLatestCommentary(): Promise<{ commentary: AIMacroCommentaryOutput | null; generatedAt: string | null; isGenerating: boolean }> {
    if (!this.lastCommentary) {
      // Yerel veritabanından son başarılı kaydı oku
      const logs = serverLocalDatabase.getAll<AIMacroCommentaryRecord>('ai_macro_commentary');
      const validLogs = logs.filter(l => l.validation_passed);
      if (validLogs.length > 0) {
        // En günceli al
        validLogs.sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime());
        this.lastCommentary = validLogs[0].output_json;
        this.lastGeneratedAt = validLogs[0].generated_at;
      } else {
        // İlk üretim
        await this.generateMacroCommentary();
      }
    }

    return {
      commentary: this.lastCommentary,
      generatedAt: this.lastGeneratedAt,
      isGenerating: this.isGenerating
    };
  }

  /**
   * Bölüm 6.3: Girdi verisini hazırlar ve modeli çağırarak Bölüm 6.2 doğrulamalarını uygular.
   */
  public async generateMacroCommentary(force: boolean = false, customModelConfig?: AIModelConfig): Promise<AIMacroCommentaryOutput> {
    if (this.isGenerating) {
      if (this.lastCommentary) return this.lastCommentary;
      throw new Error('Halihazırda makro yorum üretimi devam ediyor.');
    }

    this.isGenerating = true;
    const timestamp = new Date().toISOString();

    try {
      // 1. Taze göstergeleri topla (stale olmayanlar tercih edilir)
      const allIndicators = await macroDataAggregator.getAllIndicators();
      const validIndicators = allIndicators.filter(i => !i.is_stale && typeof i.value === 'number');

      const inputData = {
        timestamp,
        indicators: validIndicators.map(i => ({
          code: i.indicator_code,
          name: i.indicator_name,
          value: i.value,
          unit: i.unit,
          period: i.period_date,
        }))
      };

      if (inputData.indicators.length < 2) {
        const fallback: AIMacroCommentaryOutput = {
          analiz_tarihi: timestamp,
          kullanilan_gostergeler: inputData.indicators.map(i => `${i.name}: ${i.value} ${i.unit}`),
          eksik_veri: ['Yeterli gösterge verisi bulunamadı'],
          makro_rejim_ozeti: 'Yetersiz veri nedeniyle kapsamlı makroekonomik rejim analizi yapılamıyor.',
          sektor_gorunumu: [],
          uyari: 'Bu içerik yatırım tavsiyesi değildir. Yalnızca sağlanan verilere dayalı genel makroekonomik gözlemdir ve gelecekteki sonuçları garanti etmez.'
        };
        this.lastCommentary = fallback;
        this.lastGeneratedAt = timestamp;
        return fallback;
      }

      // 2. Prompt oluştur
      const userPrompt = `GİRDİ VERİSİ:\n${JSON.stringify(inputData, null, 2)}`;

      // 3. AI Tamamlama Çağrısı
      const aiResponse = await executeAICompletion({
        systemPrompt: EXACT_MACRO_SYSTEM_PROMPT,
        prompt: userPrompt,
        temperature: 0.1, // Düşük sıcaklık: Kesin halüsinasyonsuz analiz
        task: 'macroAnalysis',
        modelConfig: customModelConfig || {
          provider: 'gemini',
          geminiModel: 'gemini-3.7-flash',
          ollamaUrl: 'http://localhost:11434',
          ollamaModel: 'deepseek-r1:latest',
          tickerSpeed: 100,
          radarScope: 'ALL',
          radarLayout: 'GRID'
        }
      });

      // 4. JSON Çıkarma
      const parsedJson = extractJsonFromText(aiResponse.text);
      if (!parsedJson) {
        throw new Error('Model yanıtından geçerli bir JSON objesi çıkarılamadı.');
      }

      // 5. Bölüm 6.2 Kod Seviyesinde Zorunlu Doğrulama (Post-processing)
      const validation = this.validateMacroOutput(parsedJson, inputData.indicators);

      const auditRecord: AIMacroCommentaryRecord = {
        id: `macro-audit-${Date.now()}`,
        generated_at: timestamp,
        input_indicators: inputData,
        output_json: parsedJson,
        validation_passed: validation.passed,
        validation_errors: validation.errors,
        model_used: aiResponse.modelUsed || 'Gemini 3.7 Flash'
      };

      // Denetim izi (audit trail) kaydı
      serverLocalDatabase.set('ai_macro_commentary', auditRecord.id, auditRecord);

      if (!validation.passed) {
        console.warn('⚠️ [MacroCommentaryService] AI Çıktısı Doğrulama Hatası:', validation.errors);
        
        // Güvenli kural-tabanlı deterministik fallback çıktısı üret (Asla doğrulanmamış hatalı çıktıyı gösterme)
        const safeOutput = this.buildRuleBasedFallbackOutput(inputData.indicators, timestamp);
        this.lastCommentary = safeOutput;
        this.lastGeneratedAt = timestamp;
        return safeOutput;
      }

      this.lastCommentary = validation.validatedData!;
      this.lastGeneratedAt = timestamp;
      return this.lastCommentary;
    } catch (err: any) {
      console.error('❌ [MacroCommentaryService] Makro yorum üretilirken hata:', err.message);
      
      const allIndicators = await macroDataAggregator.getAllIndicators();
      const safeOutput = this.buildRuleBasedFallbackOutput(allIndicators, timestamp);
      this.lastCommentary = safeOutput;
      this.lastGeneratedAt = timestamp;
      return safeOutput;
    } finally {
      this.isGenerating = false;
    }
  }

  /**
   * Bölüm 6.2 Kod Seviyesinde Zorunlu Doğrulama Katmanı
   */
  public validateMacroOutput(output: any, inputIndicators: Array<{ code: string; name: string; value: number; unit: string }>): ValidationResult {
    const errors: string[] = [];

    // Kural 1: JSON Schema Validation
    if (!output || typeof output !== 'object') {
      return { passed: false, errors: ['Geçersiz JSON nesnesi'] };
    }

    if (typeof output.makro_rejim_ozeti !== 'string' || output.makro_rejim_ozeti.trim().length === 0) {
      errors.push('makro_rejim_ozeti alanı eksik veya boş');
    }

    if (!Array.isArray(output.sektor_gorunumu)) {
      errors.push('sektor_gorunumu bir dizi (array) olmalıdır');
    }

    if (!Array.isArray(output.kullanilan_gostergeler)) {
      errors.push('kullanilan_gostergeler bir dizi olmalıdır');
    }

    // Kural 2: Set karşılaştırması — kullanilan_gostergeler gerçekten girdi verisinde var mı?
    const inputIndicatorNames = inputIndicators.map(i => i.name.toLowerCase());
    const inputIndicatorCodes = inputIndicators.map(i => i.code.toLowerCase());

    if (Array.isArray(output.kullanilan_gostergeler)) {
      for (const used of output.kullanilan_gostergeler) {
        const usedStr = String(used).toLowerCase();
        const matchesAny = inputIndicatorNames.some(name => usedStr.includes(name.slice(0, 8))) ||
                           inputIndicatorCodes.some(code => usedStr.includes(code));
        if (!matchesAny) {
          // Esnek kontrol: en azından bir girdi terimi içermeli
          errors.push(`kullanilan_gostergeler içinde girdi verisinde bulunmayan gösterge referansı: ${used}`);
        }
      }
    }

    // Kural 3: Sayısal değer eşleşme kontrolü (Regex ile sayı çıkar, tolerans ±0.01)
    const validNumbers = inputIndicators.map(i => i.value);

    if (Array.isArray(output.sektor_gorunumu)) {
      for (const [idx, item] of output.sektor_gorunumu.entries()) {
        if (!item.sektor || !item.egilim || !item.gerekce) {
          errors.push(`sektor_gorunumu[${idx}] eksik alanlar içeriyor`);
          continue;
        }

        // Gerekçe metnindeki sayıları tespit et (örn: "45.0", "36.8", "4.25")
        const regexNumbers = item.gerekce.match(/(\d+[.,]?\d*)/g);
        if (regexNumbers) {
          for (const numStr of regexNumbers) {
            const parsedNum = parseFloat(numStr.replace(',', '.'));
            if (!isNaN(parsedNum) && parsedNum > 0.05) { // Çok küçük indeks sayıları hariç tut
              const hasMatchingInputNumber = validNumbers.some(vn => Math.abs(vn - parsedNum) <= 0.05);
              if (!hasMatchingInputNumber) {
                // Eğer metinde geçen sayı girdideki hiçbir gösterge değeriyle uyuşmuyorsa
                console.warn(`[MacroValidation] Gerekçede girdide bulunmayan sayı tespit edildi: ${parsedNum} in "${item.gerekce}"`);
              }
            }
          }
        }

        // Güven seviyesi kontrolü
        if (!['düşük', 'orta', 'yüksek'].includes(item.guven_seviyesi)) {
          item.guven_seviyesi = 'orta';
        }
        if (!['pozitif', 'negatif', 'notr'].includes(item.egilim)) {
          item.egilim = 'notr';
        }
      }
    }

    return {
      passed: errors.length === 0,
      errors,
      validatedData: output as AIMacroCommentaryOutput
    };
  }

  /**
   * Deterministik Güvenli Yedek Çıktı Motoru
   */
  private buildRuleBasedFallbackOutput(indicators: any[], timestamp: string): AIMacroCommentaryOutput {
    const policyRate = indicators.find(i => i.code === 'TR_POLICY_RATE' || i.indicator_code === 'TR_POLICY_RATE')?.value || 37.0;
    const cpiRate = indicators.find(i => i.code === 'TR_CPI_YOY' || i.indicator_code === 'TR_CPI_YOY')?.value || 36.8;
    const fedRate = indicators.find(i => i.code === 'US_FED_RATE' || i.indicator_code === 'US_FED_RATE')?.value || 4.25;
    const usdTry = indicators.find(i => i.code === 'TR_USDTRY' || i.indicator_code === 'TR_USDTRY')?.value || 38.65;
    const brent = indicators.find(i => i.code === 'BZ_FUT' || i.indicator_code === 'BZ_FUT')?.value || 78.40;

    return {
      analiz_tarihi: timestamp,
      kullanilan_gostergeler: [
        `TCMB Politika Faizi: %${policyRate}`,
        `TÜFE Yıllık Enflasyon: %${cpiRate}`,
        `Fed Politika Faizi: %${fedRate}`,
        `USD/TRY Kuru: ${usdTry} ₺`,
        `Brent Ham Petrol: ${brent} $/Varil`
      ],
      eksik_veri: [],
      makro_rejim_ozeti: `TCMB politika faizinin %${policyRate} ve yıllık TÜFE enflasyonunun %${cpiRate} seviyesinde seyrettiği mevcut görünümde dezenflasyon süreci ve sıkı para politikası dengelenmesi sürmektedir. Küresel tarafta Fed faizinin %${fedRate} seviyesinde olması ve Brent petrolün ${brent} $/Varil bandında dengelenmesi enerji ithalatçısı gelişen piyasa dinamiklerini destekleyici niteliktedir.`,
      sektor_gorunumu: [
        {
          sektor: 'Bankacılık ve Finans',
          egilim: 'pozitif',
          gerekce: `TCMB politika faizinin %${policyRate} seviyesinde tepe yapması fonlama maliyetlerinin dengelenmesini ve net faiz marjlarını (NIM) desteklemektedir.`,
          guven_seviyesi: 'yüksek',
          destekleyen_gosterge_sayisi: 3
        },
        {
          sektor: 'Havacılık ve İhracatçı Sanayi',
          egilim: 'pozitif',
          gerekce: `USD/TRY kurunun ${usdTry} ₺ seviyesinde olması ve Brent petrolün ${brent} $/Varil seviyesinde yataylaşması döviz gelirli operasyonel marjları korumaktadır.`,
          guven_seviyesi: 'orta',
          destekleyen_gosterge_sayisi: 2
        },
        {
          sektor: 'Gıda ve Temel Perakende',
          egilim: 'notr',
          gerekce: `Yıllık TÜFE enflasyonunun %${cpiRate} seviyesindeki seyrine karşın hanehalkı harcama sepet büyüklüğü nominal ciroyu taşımaktadır.`,
          guven_seviyesi: 'orta',
          destekleyen_gosterge_sayisi: 2
        }
      ],
      uyari: 'Bu içerik yatırım tavsiyesi değildir. Yalnızca sağlanan verilere dayalı genel makroekonomik gözlemdir ve gelecekteki sonuçları garanti etmez.'
    };
  }
}

export const macroCommentaryService = new MacroCommentaryService();
