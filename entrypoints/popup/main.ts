import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div style="padding: 16px; text-align: center; min-width: 250px;">
    <img src="/48.png" alt="UYAP Logo" style="width: 48px; height: 48px; margin-bottom: 12px;" />
    <h2 style="font-size: 16px; margin: 0; color: #333;">UYAP Toplu İndirme</h2>
    <p style="font-size: 13px; color: #666; margin-top: 8px; line-height: 1.4;">
      Eklenti aktif. Lütfen UYAP portalında evrak listesi ekranına gidin.
    </p>
  </div>
`;