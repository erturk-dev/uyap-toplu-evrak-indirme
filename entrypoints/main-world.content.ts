export default defineContentScript({
  matches: ['https://*.uyap.gov.tr/*'],
  world: 'MAIN',
  runAt: 'document_idle',
  main() {
    function indirEvrakSessiz(evrakId: string, yargiTuru = '1') {
      const realOpen = window.open;
      // @ts-expect-error sayfa global'i
      window.open = function (_url: string, name: string) {
        const f = document.createElement('iframe');
        f.name = name;
        f.style.display = 'none';
        document.body.appendChild(f);
        setTimeout(() => f.remove(), 60000);
        return f.contentWindow;
      };
      try {
        // @ts-expect-error sayfa global fonksiyonu
        downloadDoc(evrakId, window.dosyaId, yargiTuru);
        return true;
      } catch (err) {
        console.error('indirme hatası', err);
        return false;
      } finally {
        setTimeout(() => { window.open = realOpen; }, 0);
      }
    }

    window.addEventListener('message', (e) => {
      if (e.source !== window) return;
      const data = e.data as any;
      if (data?.source !== 'UYAPX' || data.type !== 'INDIR') return;
      const ok = indirEvrakSessiz(data.evrakId, data.yargiTuru);
      window.postMessage({ source: 'UYAPX', type: 'INDIR_SONUC', reqId: data.reqId, ok }, '*');
    });
  },
});