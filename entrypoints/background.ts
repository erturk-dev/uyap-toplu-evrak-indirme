export default defineBackground(() => {
  // Tek bir hedef yerine, bekleyen hedefleri sırayla tutacağımız bir dizi (kuyruk) oluşturuyoruz.
  const bekleyenHedefler: { klasor: string; ad: string }[] = [];

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'sirada-bekleyen') {
      // Gelen her yeni hedefi kuyruğun sonuna ekliyoruz
      bekleyenHedefler.push({ klasor: msg.klasor, ad: msg.ad });
    }
  });

  chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
    // Eğer kuyrukta bekleyen hedef yoksa mevcut işlemi atla
    if (bekleyenHedefler.length === 0) return;

    // Kuyruğun en başındaki (ilk gelen) hedefi al ve kuyruktan çıkar
    const siradakiHedef = bekleyenHedefler.shift();
    if (!siradakiHedef) return;

    const { klasor, ad } = siradakiHedef;

    // 1. Sunucudan gelen gerçek dosyanın uzantısını bul (örneğin ".pdf", ".zip")
    const gercekUzantiMatch = item.filename.match(/\.[0-9a-z]+$/i);
    const gercekUzanti = gercekUzantiMatch ? gercekUzantiMatch[0].toLowerCase() : '';

    // 2. content.ts tarafından uydurulan uzantıyı atıp gerçek uzantıyı ekle
    let nihaiAd = ad;
    if (gercekUzanti) {
      const sonNoktaIndex = ad.lastIndexOf('.');
      if (sonNoktaIndex > 0) {
        // Eski uzantıyı kes (.udf gibi), gerçek uzantıyı ekle
        nihaiAd = ad.substring(0, sonNoktaIndex) + gercekUzanti;
      } else {
        nihaiAd = ad + gercekUzanti;
      }
    }

    // 3. Dosyayı kaydet
    suggest({ filename: `UYAP/${klasor}/${nihaiAd}`, conflictAction: 'uniquify' });
  });
});