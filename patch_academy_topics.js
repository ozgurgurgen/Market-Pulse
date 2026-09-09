const fs = require('fs');

let fileContent = fs.readFileSync('server/routes/advancedFeaturesRouter.ts', 'utf8');

const newTopicsStr = `
  {
    id: 'current-ratio',
    title: 'Cari Oran (Current Ratio)',
    category: 'likidite_oranlari',
    categoryLabel: 'Likidite ve Borç Ödeme Gücü',
    shortDescription: 'Şirketin kısa vadeli borçlarını, dönen varlıklarıyla ödeyebilme kapasitesidir.',
    formula: 'Cari Oran = Dönen Varlıklar / Kısa Vadeli Yabancı Kaynaklar',
    interpretationGuide: '1.5 ve üzeri genellikle güvenli kabul edilir. 1.0 altı ise nakit sıkışıklığı sinyali olabilir.',
    idealRange: 'Sanayi şirketleri için 1.5x - 2.0x, perakende için 1.0x civarı normaldir.',
    practicalExample: 'BİM gibi peşin satan perakendecilerde 1.0x bile yeterliyken, vadeli satan bir sanayi firmasında 1.5x aranır.',
    commonMistakes: [
      'Stok devir hızına bakmadan sadece Cari Oranın yüksek olmasına güvenip şirketi likit sanmak'
    ],
    proTip: 'Cari oranın 3.0x üzerine çıkması, şirketin nakdini veya stoklarını verimli kullanamadığının (atıl bıraktığının) işareti olabilir.',
    iconName: 'Droplets'
  },
  {
    id: 'acid-test',
    title: 'Asit-Test (Likidite) Oranı',
    category: 'likidite_oranlari',
    categoryLabel: 'Likidite ve Borç Ödeme Gücü',
    shortDescription: 'Stokların hızlı paraya çevrilemeyeceği varsayımıyla, en likit varlıkların kısa vadeli borçları karşılama gücüdür.',
    formula: 'Asit-Test = (Dönen Varlıklar - Stoklar) / Kısa Vadeli Yabancı Kaynaklar',
    interpretationGuide: 'Genellikle 1.0 ve üzeri idealdir. Şirketin elindeki nakit ve alacaklarla acil borçları ödeyip ödeyemeyeceğini gösterir.',
    idealRange: 'Çoğu sektör için 1.0x idealdir.',
    practicalExample: 'Otomotiv veya gayrimenkul gibi stokların yavaş eridiği sektörlerde Asit-Test oranı, Cari Orana göre çok daha gerçeği yansıtır.',
    commonMistakes: [
      'Hizmet sektöründeki bir şirketle sanayi şirketini aynı Asit-Test oranında kıyaslamak (Hizmette stok zaten yoktur).'
    ],
    proTip: 'Asit-Test oranı 1 in çok altındaysa, şirket vadesi gelen borcunu ödemek için elindeki malı (stokları) zararına satmak zorunda kalabilir.',
    iconName: 'Beaker'
  },
  {
    id: 'net-debt-ebitda',
    title: 'Net Borç / FAVÖK',
    category: 'borcluluk',
    categoryLabel: 'Borçluluk ve Risk',
    shortDescription: 'Şirketin tüm net borcunu, mevcut operasyonel kârıyla kaç yılda sıfırlayabileceğini gösterir.',
    formula: 'Net Borç / FAVÖK = (Kısa + Uzun Finansal Borçlar - Nakit) / Yıllıklandırılmış FAVÖK',
    interpretationGuide: 'Borç çevirme kapasitesinin en kritik göstergesidir. Yükseldikçe iflas veya bedelli sermaye artırımı riski artar.',
    idealRange: '2.5x ve altı güvenli, 3.5x üzeri riskli, 5.0x üzeri çok risklidir.',
    practicalExample: 'TÜPRAŞ (TUPRS) gibi güçlü şirketlerde bu oran genellikle sıfıra yakın veya negatiftir (Kasada net nakit vardır).',
    commonMistakes: [
      'FAVÖK düşüş trendindeyken eski (geçmiş 12 ay) FAVÖK ile oranı hesaplayıp riskin düşük olduğunu sanmak'
    ],
    proTip: 'Net Borç / FAVÖK oranı 3 ü geçen şirketlerde faiz giderleri, net kârı tamamen yok edebilir (kâr erimesi).',
    iconName: 'AlertTriangle'
  },
  {
    id: 'gross-net-margin',
    title: 'Brüt ve Net Kâr Marjı',
    category: 'karlilik',
    categoryLabel: 'Kârlılık ve Verimlilik',
    shortDescription: 'Satışlardan elde edilen gelirin, maliyetler ve giderler düştükten sonra ne kadarının şirkete kaldığıdır.',
    formula: 'Brüt Marj = (Brüt Kâr / Hasılat); Net Marj = (Net Kâr / Hasılat)',
    interpretationGuide: 'Brüt marj üretimdeki (maliyet) hakimiyeti, net marj ise tüm giderler (yönetim, finansman, vergi) sonrası başarıyı gösterir.',
    idealRange: 'Yazılımda %40+, Sanayide %15-20, Perakendede %3-5 (sektöre göre çok değişir).',
    practicalExample: 'Yazılım şirketleri (örn. LOGO) %80 brüt marjla çalışırken, zincir marketler (BIMAS) %15 brüt marjla çalışıp sürümden kazanır.',
    commonMistakes: [
      'Vergi geliri veya tek seferlik satışla artan Net Marjı, şirketin ana işi çok kârlıymış gibi yorumlamak'
    ],
    proTip: 'Esas Faaliyet Kârı Marjı her zaman Net Kâr Marjından daha güvenilir ve sürdürülebilirdir.',
    iconName: 'Percent'
  },
  {
    id: 'inventory-turnover',
    title: 'Stok ve Alacak Devir Hızı',
    category: 'karlilik',
    categoryLabel: 'Kârlılık ve Verimlilik',
    shortDescription: 'Şirketin deposundaki malı ne kadar hızlı sattığını ve sattığı malın parasını ne kadar hızlı tahsil ettiğini ölçer.',
    formula: 'Stok Devir = SMM / Ortalama Stok; Alacak Devir = Net Satışlar / Ortalama Ticari Alacak',
    interpretationGuide: 'Yüksek devir hızı şirketin verimli çalıştığını, nakit döngüsünün güçlü olduğunu gösterir.',
    idealRange: 'Sektör ortalamasından daha yüksek olması istenir.',
    practicalExample: 'Enflasyon ortamında stok devir hızını isteyerek yavaşlatan şirketler (stokçuluk/hedge) kâr marjını geçici olarak artırabilir.',
    commonMistakes: [
      'Mevsimsel şirketlerde tek bir çeyrek verisiyle devir hızı hesaplayıp şirketi yavaş/hızlı zannetmek'
    ],
    proTip: 'Alacak tahsil süresi uzuyorsa (devir hızı düşüyorsa), şirket satışları artırıyor görünse de gizli bir nakit krizi (tahsilat sorunu) yaşıyor olabilir.',
    iconName: 'RefreshCw'
  },
  {
    id: 'peg-ratio',
    title: 'PEG Rasyosu (Fiyat / Kazanç / Büyüme)',
    category: 'temel_oranlar',
    categoryLabel: 'Temel Değerleme Oranları',
    shortDescription: 'Fiyat/Kazanç (F/K) oranının, şirketin net kâr büyüme oranına bölünmesiyle bulunur.',
    formula: 'PEG = F/K Oranı / Beklenen Yıllık Kâr Büyüme Oranı (%)',
    interpretationGuide: 'Yüksek F/K ile fiyatlanan şirketlerin, eğer çok hızlı büyüyorlarsa aslında "ucuz" olabileceğini gösteren efsanevi metriktir (Peter Lynch).',
    idealRange: '1.0 altı ucuz (büyümesine göre kelepir), 1.0 adil, 1.5 ve üzeri pahalıdır.',
    practicalExample: 'F/K sı 20 olan bir teknoloji şirketi her yıl %40 büyüyorsa PEG = 0.5 olur ve oldukça ucuz sayılır.',
    commonMistakes: [
      'Geçmiş yıllardaki (tesadüfi) büyümeyi gelecekte de aynı kalacak varsayarak PEG hesaplamak'
    ],
    proTip: 'Büyüme oranı enflasyonun altındaysa PEG hesaplamak yanıltıcı olur; şirket reel olarak küçülüyordur.',
    iconName: 'Rocket'
  },
  {
    id: 'free-cash-flow',
    title: 'Serbest Nakit Akımı (FCF)',
    category: 'degerleme_modelleri',
    categoryLabel: 'Değerleme ve Finansal Analiz Modelleri',
    shortDescription: 'Tüm operasyonel giderler ve zorunlu yatırımlar (CAPEX) yapıldıktan sonra şirketin kasasında kalan "gerçek, dağıtılabilir nakit".',
    formula: 'FCF = İşletme Faaliyetlerinden Sağlanan Nakit - Yatırım Harcamaları (CAPEX)',
    interpretationGuide: 'Net kâr muhasebeseldir (maniple edilebilir), Serbest Nakit ise gerçektir. Temettünün yegâne sürdürülebilir kaynağıdır.',
    idealRange: 'FCF / Net Kâr > 0.8 (Kârın en az %80 i nakde dönmeli)',
    practicalExample: 'Bir şirket milyarlarca lira "Net Kâr" açıklayıp Serbest Nakit Akımı negatifse, o kâr tamamen borca veya stoka gömülmüş demektir; temettü ödeyemez.',
    commonMistakes: [
      'Hızlı büyüyen şirketlerde agresif fabrika yatırımları nedeniyle FCF negatif çıkmasını "şirket para kaybediyor" diye yanlış yorumlamak'
    ],
    proTip: 'Firma Değeri / Serbest Nakit Akımı çarpanı, birçok profesyonel için F/K dan çok daha güvenilir bir değerleme kriteridir.',
    iconName: 'Banknote'
  },
  // END OF NEW
`;

const insertIndex = fileContent.indexOf('];', fileContent.indexOf('const ACADEMY_TOPICS'));
if (insertIndex !== -1) {
  fileContent = fileContent.slice(0, insertIndex) + ',' + newTopicsStr + fileContent.slice(insertIndex);
  fs.writeFileSync('server/routes/advancedFeaturesRouter.ts', fileContent);
  console.log('Successfully added new topics to advancedFeaturesRouter.ts');
} else {
  console.log('Failed to find ACADEMY_TOPICS array end');
}
