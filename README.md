# ⚖️ UYAP Toplu Evrak İndirme

Bu eklenti, UYAP Vatandaş Portalı üzerindeki dosya inceleme ve evrak indirme süreçlerini hızlandırmak ve kullanıcı deneyimini iyileştirmek amacıyla geliştirilmiş bir arayüz çalışmasıdır. 

Eklenti; evrakları tek bir ekranda daha rahat arama, sütunlara göre sıralama, sayfalamayı yönetme ve seçilen evrakları toplu olarak bilgisayara indirme gibi özellikler sunar.

## ⚠️ Sorumluluk Reddi ve Yasal Uyarı

* **Bağımsız Çalışma:** Bu eklentinin Adalet Bakanlığı veya UYAP (Ulusal Yargı Ağı Bilişim Sistemi) ile hiçbir resmi bağı yoktur. Sadece kullanıcı deneyimini iyileştirmeye yönelik bağımsız bir arayüz çalışmasıdır.
* **Yetki ve Kullanım Sınırları:** Eklenti, kullanıcının mevcut yetkilerini aşan hiçbir işlem yapmaz veya UYAP sistemlerine dışarıdan müdahale etmez. Sadece yasal ve meşru amaçlar için, yardımcı bir araç olarak kullanılmalıdır. Yasa dışı veya yetkisiz kullanımdan doğabilecek tüm hukuki ve cezai sorumluluklar tamamen kullanıcıya aittir.
* **Sistem Hataları:** Eklentinin kullanımından kaynaklanabilecek; eksik evrak indirme, hatalı dosyalama veya UYAP sistemindeki altyapı güncellemeleri nedeniyle eklentinin çalışmaması gibi durumlarda sorumluluk kullanıcıdadır.
* **İndirilen Dosyaların Kontrolü:** İşlem sonucunda indirilen evrakların tam ve eksiksiz olduğu kullanıcı tarafından mutlaka teyit edilmelidir. Gözden kaçan veya eksik inen dosyalardan kaynaklı yaşanabilecek hak kayıplarında geliştirici hiçbir hukuki veya cezai sorumluluk kabul etmez.

**Eklentiyi kullananlar bu şartları peşinen kabul etmiş sayılır.**

## 📥 Kurulum

Eklentiyi tarayıcınıza resmi mağazalardan tek tıkla ve güvenle kurabilirsiniz:

* [Chrome Web Mağazası'ndan Yükle](#TODO-CHROME-LINK)
* [Firefox Add-ons'tan Yükle](#TODO-FIREFOX-LINK)

## 🚀 Kullanım Şekli

1. Eklentiyi yukarıdaki bağlantılardan tarayıcınıza yükleyin.
2. UYAP Vatandaş Portalı'na giriş yapın.
3. İncelemek istediğiniz mahkeme dosyasının içine girip sol menüden **Evrak** sekmesine tıklayın.
4. Evrak listesi yüklendiğinde, sağ üst köşede eklentiye ait butonu göreceksiniz.
5. İndirmek istediğiniz evrakları seçip toplu indirme işlemini başlatabilirsiniz.

Eklenti, bilgisayarınızdaki "İndirilenler" klasöründe `UYAP` adında bir ana klasör oluşturur ve işlemleri bunun içinde organize eder. İki farklı indirme seçeneği mevcuttur:

* **Tüm evrakları tek klasörde topla:** Seçilen evraklar `İndirilenler/UYAP/[Mahkeme Dosya Adı]` şeklinde oluşturulan tek bir klasörün içine liste halinde indirilir.
* **UYAP'taki klasör yapısını koru:** Seçilen evraklar, UYAP sistemindeki orijinal klasör isimleri referans alınarak `İndirilenler/UYAP/[Mahkeme Dosya Adı]/[Evrak Türü - Örn: Beyan Dilekçesi]` hiyerarşisinde indirilir.

> ⚠️ **İndirme Sırasında Bekleme (Gecikme) Hakkında:**  
> Sunucuya aşırı yüklenmemek ve indirme hatalarının önüne geçmek için işlem sırasında sabit bir bekleme süresi (delay) uygulanmaktadır. İndirme işlemi devam ederken ekranda işlem yapmaya devam edebilirsiniz; ancak eksik evrak inmemesi veya sürecin kesintiye uğramaması adına pencerenin/sekmenin arka plana atılmaması ve açık kalması tavsiye edilir.

## 🔒 Gizlilik

Bu eklenti tamamen tarayıcınızda (istemci tarafında) çalışır.
* Tüm veri talepleri doğrudan sizin bilgisayarınızdan UYAP sunucularına yapılır.
* İndirilen dosyalar doğrudan kendi cihazınıza kaydedilir.
* Araya giren hiçbir sunucu, sunucu taraflı bir veritabanı veya log tutma işlemi yoktur. Kişisel verileriniz veya dosya içerikleriniz hiçbir şekilde üçüncü şahıslara veya dış sunuculara aktarılmaz.

## 🤝 Geri Bildirim ve Hata Bildirimi

Bu proje, adalete ve hukuki süreçleri takip eden kullanıcılara naçizane bir kolaylık sağlamak amacıyla hobi olarak geliştirilmiştir. Eklentinin diğer kullanıcılar için de faydalı olabilmesi adına her türlü geri bildirim önemlidir.

Karşılaştığınız hataları bildirmek veya özellik önerilerinizi iletmek için GitHub üzerinden [Issues](https://github.com/erturk-dev/uyap-toplu-evrak-indirme/issues) sekmesini kullanabilir veya **[dev.erturk@gmail.com](mailto:dev.erturk@gmail.com)** adresinden iletişime geçebilirsiniz.

---
*Bu proje [WXT](https://wxt.dev/) kullanılarak oluşturulmuştur.*