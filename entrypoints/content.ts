import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css';

export default defineContentScript({
  matches: ['https://*.uyap.gov.tr/*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'uyapx-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        container.innerHTML = `
          <div id="uyapx-overlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2147483647;">
            <div style="background:#f8fafc; margin:40px auto; width:90%; max-width:1100px; height:90vh; border-radius:8px; display:flex; flex-direction:column; border:1px solid #cbd5e1; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">              
              <div style="padding:12px 16px;border-bottom:1px solid #ddd;display:flex;justify-content:space-between;align-items:center;">
                <strong>UYAP Toplu İndirme Tablosu</strong>
                <div style="display:flex; align-items:center; gap:12px;">
                  <div style="font-size:12px; background:#f1f5f9; padding:4px 8px; border-radius:4px; border:1px solid #cbd5e1; display:flex; align-items:center; gap:8px;">
                    <span>Klasörleme:</span>
                    <label style="cursor:pointer;"><input type="radio" name="uyapx-klasor-tipi" value="koru" checked> Yapıyı Koru</label>
                    <label style="cursor:pointer;"><input type="radio" name="uyapx-klasor-tipi" value="tek"> Tek Klasörde Topla</label>
                  </div>

                  <button id="uyapx-indir-btn" class="uyap-vibrant-btn">Seçilenleri İndir</button>
                  <a href="https://github.com/erturk-dev/uyap-toplu-evrak-indirme" target="_blank" title="Nasıl Kullanılır ve Gizlilik Detayları" style="text-decoration:none; font-size:14px; font-weight:bold; display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; background:#f1f5f9; color:#475569; border:1px solid #cbd5e1; box-shadow:0 1px 2px rgba(0,0,0,0.05); transition:all 0.2s ease; font-family:inherit;" onmouseover="this.style.backgroundColor='#e2e8f0'; this.style.color='#0f172a';" onmouseout="this.style.backgroundColor='#f1f5f9'; this.style.color='#475569';">?</a>
                  <button id="uyapx-kapat-btn" class="uyap-vibrant-btn" style="background:#dc3545!important;">X</button>
                </div>
              </div>
              <div id="uyapx-uyari" style="display:none;padding:8px 16px;background:#fff3cd;color:#856404;font-size:13px;"></div>
              <div id="uyapx-grid" style="flex:1;overflow:auto;padding:8px;"></div>
              <div id="uyapx-durum" style="padding:8px 16px;border-top:1px solid #eee;font-size:13px;"></div>
              <div id="uyapx-progress-container" style="display:none; padding:6px 16px; background:#eff6ff; border-top:1px solid #e2e8f0; font-size:12px; display:flex; flex-direction:column; gap:4px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span id="uyapx-progress-text" style="color:#1d4ed8; font-weight:600;">Hazır...</span>
                <span id="uyapx-progress-warning" style="color:#b45309; font-weight:500; display:none;">⚠️ İndirmeler bitene kadar bu sekmeden ayrılmak, işlemin kesilmesine neden olabilir!</span>
              </div>
              <progress id="uyapx-pb" value="0" max="100" style="width:100%; height:6px; accent-color:#2563eb;"></progress>
            </div>
            </div>
          </div>
        `;

        const btnStyle = document.createElement('style');
        btnStyle.innerHTML = `
            .uyap-vibrant-btn {
                background: #497ab6;
                color: white;
                font-weight: 600;
                font-size: 14px;
                border: none;
                border-radius: 3px;
                padding: 8px 16px;
                cursor: pointer;
                white-space: nowrap;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                transition: all 0.3s ease;
            }
            .uyap-vibrant-btn:hover {
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                background: #186ef8;
            }
            .tabulator-header-filter input {
                width: 100%;
                padding: 4px;
                box-sizing: border-box;
                border: 1px solid #ccc;
                border-radius: 3px;
                font-size: 12px;
            }
        `;
        document.head.appendChild(btnStyle);
        container.appendChild(btnStyle.cloneNode(true));

        const fullStyle = document.createElement('style');
        fullStyle.innerHTML = `
            #uyapx-overlay {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                color: #334155;
            }
            #uyapx-overlay * {
                box-sizing: border-box;
            }
            #uyapx-overlay > div {
                background: #f8fafc !important;
                border: 1px solid #cbd5e1 !important;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
            }
            #uyapx-overlay strong {
                color: #0f172a;
                font-size: 15px;
                font-weight: 600;
                letter-spacing: -0.01em;
            }
            #uyapx-search-input {
                background: #ffffff !important;
                color: #1e293b !important;
                border: 1px solid #cbd5e1 !important;
                border-radius: 6px !important;
                padding: 7px 12px !important;
                transition: all 0.2s ease;
            }
            #uyapx-search-input:focus {
                outline: none !important;
                border-color: #2563eb !important;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
            }
            #uyapx-durum {
                background: #f1f5f9 !important;
                color: #475569 !important;
                font-weight: 500;
                border-top: 1px solid #e2e8f0 !important;
            }
            #uyapx-overlay > div > div:first-child {
                background: #ffffff !important;
                border-bottom: 2px solid #e2e8f0 !important;
            }
            #uyapx-overlay strong {
                color: #1e3a8a !important; 
                font-size: 16px !important;
            }
            .uyap-vibrant-btn {
                background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
                box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25) !important;
            }
            .uyap-vibrant-btn:hover {
                background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important;
            }
            .tabulator {
                background-color: #ffffff !important;
                border: 1px solid #e2e8f0 !important;
                border-radius: 6px !important;
            }
            .tabulator .tabulator-header {
                background-color: #f1f5f9 !important;
                color: #334155 !important;
                font-weight: 700 !important;
                border-bottom: 2px solid #cbd5e1 !important;
            }
            .tabulator .tabulator-header .tabulator-col {
                background-color: transparent !important;
            }
            .tabulator .tabulator-table .tabulator-row {
                background-color: #ffffff !important;
                color: #1e293b !important;
                border-bottom: 1px solid #f1f5f9 !important;
            }
            .tabulator .tabulator-table .tabulator-row:nth-child(even) {
                background-color: #f8fafc !important; 
            }
            .tabulator .tabulator-table .tabulator-row:hover {
                background-color: #eff6ff !important; 
                color: #1d4ed8 !important;
            }
            .tabulator-header-filter input {
                background-color: #ffffff !important;
                border: 1px solid #94a3b8 !important;
                border-radius: 4px !important;
            }
            .tabulator-header-filter input:focus {
                border-color: #2563eb !important;
                box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2) !important;
            }
        `;
        container.appendChild(fullStyle);


        const trigger = document.createElement('button');
        trigger.id = 'uyapx-trigger-btn';
        trigger.textContent = 'Toplu İndirme Tablosunu Aç';
        trigger.className = 'uyap-vibrant-btn';
        trigger.style.cssText = 'padding: 5px 12px; margin-right: 10px; cursor: pointer; white-space: nowrap;';

        const pWrapper = document.createElement('p');
        pWrapper.style.marginTop = '4px';
        pWrapper.appendChild(trigger);

        const observer = new MutationObserver(() => {
          if (document.getElementById('uyapx-trigger-btn')) return;
          const target = document.querySelector('p#dynamic_doc_page');
          if (target) {
            const parentTarget = target.parentElement!;
            parentTarget.style.display = 'flex';
            parentTarget.style.alignItems = 'center';
            parentTarget.style.justifyContent = 'flex-end';
            parentTarget.insertBefore(pWrapper, target);
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        let table: Tabulator | null = null;
        const overlay = container.querySelector<HTMLElement>('#uyapx-overlay')!;
        const hostElement = (container.getRootNode() as ShadowRoot).host as HTMLElement;

        const freezeUyapBackground = () => {
          Array.from(document.body.children).forEach(child => {
            if (child !== hostElement && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
              (child as HTMLElement).inert = true;
            }
          });
        };

        const unfreezeUyapBackground = () => {
          Array.from(document.body.children).forEach(child => {
            if (child !== hostElement) {
              (child as HTMLElement).inert = false;
            }
          });
        };

        trigger.onclick = () => {
          freezeUyapBackground();
          overlay.style.display = 'block';

          const uyariEl = container.querySelector<HTMLElement>('#uyapx-uyari')!;
          const kayitlar = parseUyapTree();
          const durumEl = container.querySelector<HTMLElement>('#uyapx-durum')!;
          durumEl.textContent = `Toplam ${kayitlar.length} evrak bulundu ve listeye aktarıldı.`;

          if (kayitlar.length === 0) {
            uyariEl.style.display = 'block';
            uyariEl.textContent = 'Bu sayfada evrak listesi bulunamadı. Bu eklenti Vatandaş Portalı arayüzüne göre yapılmıştır.';
          } else {
            uyariEl.style.display = 'none';
          }

          if (!table) {
            table = new Tabulator(container.querySelector('#uyapx-grid') as HTMLElement, {
              data: kayitlar,
              layout: 'fitDataFill',
              pagination: true,
              paginationSize: 25,
              paginationSizeSelector: [10, 25, 50, 100, 1000, true],
              columns: [
                { title: '', formatter: 'rowSelection', titleFormatter: 'rowSelection', hozAlign: 'center', width: 40, cellClick: (e, cell) => cell.getRow().toggleSelect() },
                { title: 'Dosya', field: 'dosyaAdi', headerFilter: 'input', headerFilterFunc: 'like', width: 130, sorter: uyapGenelSiralama },
                { title: 'Türü', field: 'turu', headerFilter: 'input', headerFilterFunc: 'like', width: 160, sorter: uyapGenelSiralama },
                { title: 'Başlık', field: 'baslik', headerFilter: 'input', headerFilterFunc: 'like', width: 200, sorter: uyapGenelSiralama },
                { title: 'Birim Evrak No', field: 'birimEvrakNo', headerFilter: 'input', headerFilterFunc: 'like', width: 120, sorter: uyapGenelSiralama },
                { title: 'Onay Tarihi', field: 'tarih', width: 110, headerFilter: 'input', headerFilterFunc: 'like', sorter: uyapGenelSiralama },
                { title: 'Sisteme Gönderildiği Tarih', field: 'sistemeGonderildigiTarih', width: 110, headerFilter: 'input', headerFilterFunc: 'like', sorter: uyapGenelSiralama },
                { title: 'Gönderen Yer/Kişi', field: 'gonderenYerKisi', headerFilter: 'input', headerFilterFunc: 'like', width: 180, sorter: uyapGenelSiralama },
                { title: 'Gönderen Dosya No', field: 'gonderenDosyaNo', headerFilter: 'input', headerFilterFunc: 'like', width: 120, sorter: uyapGenelSiralama },
                { title: 'Gönderen Sayı', field: 'gonderenSayi', headerFilter: 'input', headerFilterFunc: 'like', width: 120, sorter: uyapGenelSiralama },
                { title: 'Açıklama', field: 'aciklama', headerFilter: 'input', headerFilterFunc: 'like', width: 160, sorter: uyapGenelSiralama },
                { title: 'Tipi', field: 'tipi', width: 80, headerFilter: 'input', headerFilterFunc: 'like', sorter: uyapGenelSiralama },
              ],
              initialSort: [
                { column: "sistemeGonderildigiTarih", dir: "desc" }
              ],
              locale: "tr",
              langs: {
                "tr": {
                  "pagination": {
                    "page_size": "Sayfa Boyutu",
                    "first": "İlk",
                    "last": "Son",
                    "prev": "Önceki",
                    "next": "Sonraki",
                    "all": "Tümü",
                  }
                }
              },
            });
            table.on("rowClick", (e: any, row: any) => {
              row.toggleSelect();
            });
          } else {
            table.setData(kayitlar);
          }
        };

        container.querySelector('#uyapx-kapat-btn')!.addEventListener('click', () => {
          overlay.style.display = 'none';
          unfreezeUyapBackground();
        });

        let isDownloading = false;
        let indirmeIptal = false;
        const indirBtn = container.querySelector<HTMLButtonElement>('#uyapx-indir-btn')!;
        const indirWarning = container.querySelector<HTMLSpanElement>('#uyapx-progress-warning')!;
        indirBtn.addEventListener('click', async () => {
          if (isDownloading) {
            indirmeIptal = true;
            return;
          }

          if (!table) return;
          const secilenler = table.getSelectedData();
          if (secilenler.length === 0) { alert('Önce satır seç.'); return; }

          const klasorModu = (container.querySelector('input[name="uyapx-klasor-tipi"]:checked') as HTMLInputElement)?.value || 'koru';
          const durumEl = container.querySelector<HTMLElement>('#uyapx-durum')!;
          const progressContainer = container.querySelector<HTMLElement>('#uyapx-progress-container')!;
          const progressText = container.querySelector<HTMLElement>('#uyapx-progress-text')!;
          const pb = container.querySelector<HTMLProgressElement>('#uyapx-pb')!;

          isDownloading = true;
          indirmeIptal = false;
          durumEl.textContent = '';

          indirBtn.textContent = 'İndirmeyi Durdur';
          indirWarning.style.display = 'flex';
          indirBtn.style.setProperty('background', '#dc3545', 'important');

          progressContainer.style.display = 'flex';
          pb.value = 0;
          pb.max = secilenler.length;

          const sonuc = await topluIndir(secilenler as any[], {
            delayMs: 1000,
            klasorModu: klasorModu,
            shouldAbort: () => indirmeIptal,
            onProgress: (yapilan, toplam, r) => {
              progressText.textContent = `İndiriliyor (${yapilan}/${toplam}): ${r.baslik}`;
              pb.value = yapilan;
            },
          });

          isDownloading = false;
          indirBtn.textContent = 'Seçilenleri İndir';
          indirBtn.style.removeProperty('background');
          progressContainer.style.display = 'none';
          indirWarning.style.display = 'none';

          if (sonuc.durduruldu) {
            durumEl.textContent = `⚠️ ${sonuc.yapilan} dosya indirildikten sonra işlem durduruldu.`;
          } else {
            const basariliSayi = sonuc.yapilan - sonuc.hatalar.length;
            durumEl.textContent = sonuc.hatalar.length
              ? `⚠️ İşlem tamamlandı! ${basariliSayi} adet dosya indirildi, ${sonuc.hatalar.length} evrak ise indirilemedi (konsola bak).`
              : `✅ İşlem tamamlandı! Seçilen ${basariliSayi} adet dosya başarıyla indirildi.`;
          }

          if (sonuc.hatalar.length) console.warn('İndirilemeyenler:', sonuc.hatalar);
        });
      },
    });

    ui.mount();
  },
});

function temizle(s: string | null | undefined) {
  return (s || '').replace(/[\\/:*?"<>|]/g, '_').trim();
}

function parseTooltip(tooltipHtml: string) {
  const meta: Record<string, string> = {};
  const div = document.createElement('div');
  div.innerHTML = tooltipHtml;
  div.querySelectorAll('div').forEach((d) => {
    const [key, ...rest] = (d.textContent || '').split(':');
    if (key) meta[key.trim()] = rest.join(':').trim();
  });
  return meta;
}

interface Kayit {
  id: string;
  dosyaAdi: string;
  evrakTuru: string;
  baslik: string;
  evrakId: string;
  birimEvrakNo?: string;
  tarih?: string;
  gonderenYerKisi?: string;
  gonderenDosyaNo?: string;
  gonderenSayi?: string;
  sistemeGonderildigiTarih?: string;
  aciklama?: string;
  turu?: string;
  tipi?: string;
}

function parseUyapTree(): Kayit[] {
  const root = document.querySelector('#browser');
  if (!root) return [];

  const records: Kayit[] = [];
  const fileSpans = root.querySelectorAll('span.file');

  const rootFolderSpan = root.querySelector('li > span.folder');
  const anaDosyaAdi = rootFolderSpan ? rootFolderSpan.textContent?.trim() : 'Dava_Dosyasi';

  fileSpans.forEach((fileSpan) => {
    const evrakLi = fileSpan.closest('li');
    if (!evrakLi) return;

    const evrakId = (fileSpan.getAttribute('evrak_id') || '').replace(/^"|"$/g, '');
    if (!evrakId) return;

    const meta = parseTooltip(fileSpan.getAttribute('data-original-title') || '');
    let currentBaslik = evrakLi.getAttribute('data-sid') || fileSpan.textContent?.trim() || '';

    let parentFileNames: string[] = [];
    let parentFolderName = '';
    let currentNode = evrakLi.parentElement?.closest('li');

    while (currentNode) {
      const folderSpan = currentNode.querySelector(':scope > span.folder');
      if (folderSpan) {
        parentFolderName = currentNode.getAttribute('data-sid') || folderSpan.textContent?.trim() || '';
        break;
      }

      const parentFileSpan = currentNode.querySelector(':scope > span.file');
      if (parentFileSpan) {
        const parentAd = currentNode.getAttribute('data-sid') || parentFileSpan.textContent?.trim() || '';
        if (parentAd) parentFileNames.unshift(parentAd);
      }

      currentNode = currentNode.parentElement?.closest('li');
    }

    const evrakTuru = parentFolderName || 'Genel_Klasor';

    if (evrakTuru.includes("Dosyaya Eklenen Son 20 Evrak")) return;

    let baslik = currentBaslik;
    if (parentFileNames.length > 0) {
      baslik = [...parentFileNames, currentBaslik].join('_');
    }

    records.push({
      id: crypto.randomUUID(),
      dosyaAdi: anaDosyaAdi,
      evrakTuru,
      baslik,
      evrakId,
      birimEvrakNo: meta['Birim Evrak No'],
      tarih: meta['Evrakın Onaylandığı Tarih'],
      gonderenYerKisi: meta['Gönderen Yer/Kişi'] === 'null null' ? '' : meta['Gönderen Yer/Kişi'],
      gonderenDosyaNo: meta['Gönderen Dosya No'],
      gonderenSayi: meta['Gönderen Sayı'],
      sistemeGonderildigiTarih: meta['Sisteme Gönderildiği Tarih'],
      aciklama: meta['Açıklama'],
      turu: meta['Türü'] || evrakTuru,
      tipi: meta['Tipi'] || '',
    });
  });

  return records;
}

function indirEvrakIstek(evrakId: string): Promise<boolean> {
  return new Promise((resolve) => {
    const reqId = crypto.randomUUID();
    const handler = (e: MessageEvent) => {
      if (e.source !== window) return;
      const data = e.data as any;
      if (data?.source !== 'UYAPX' || data.type !== 'INDIR_SONUC' || data.reqId !== reqId) return;
      window.removeEventListener('message', handler);
      resolve(!!data.ok);
    };
    window.addEventListener('message', handler);
    window.postMessage({ source: 'UYAPX', type: 'INDIR', evrakId, yargiTuru: '1', reqId }, '*');
  });
}

function uyapGenelSiralama(a: any, b: any) {
  if (!a && !b) return 0;
  if (!a) return -1;
  if (!b) return 1;

  const valA = String(a).trim();
  const valB = String(b).trim();

  const datePattern = /^(\d{2})[\.\/](\d{2})[\.\/](\d{4})/;
  if (datePattern.test(valA) && datePattern.test(valB)) {
    const partsA = valA.match(datePattern)!;
    const partsB = valB.match(datePattern)!;
    const dateA = parseInt(partsA[3] + partsA[2] + partsA[1], 10);
    const dateB = parseInt(partsB[3] + partsB[2] + partsB[1], 10);
    if (dateA !== dateB) return dateA - dateB;
  }

  if (!isNaN(valA as any) && !isNaN(valB as any) && valA !== "" && valB !== "") {
    return parseFloat(valA) - parseFloat(valB);
  }

  return valA.localeCompare(valB, 'tr', { sensitivity: 'base' });
}

async function topluIndir(
  records: Kayit[],
  opts: { delayMs?: number; klasorModu?: string; shouldAbort?: () => boolean; onProgress?: (yapilan: number, toplam: number, r: Kayit) => void } = {}
) {
  const { delayMs = 1000, klasorModu = 'koru', shouldAbort, onProgress } = opts;
  const hatalar: Kayit[] = [];
  const klasorDosyaTakibi: Record<string, Set<string>> = {};
  let islemGoren = 0;
  for (let i = 0; i < records.length; i++) {
    if (shouldAbort && shouldAbort()) {
      return { hatalar, durduruldu: true, yapilan: islemGoren };
    }

    const r = records[i];
    if (!r) continue;

    const anaDosyaAdi = temizle(r.dosyaAdi) || 'Dava_Dosyasi';
    const evrakKategorisi = temizle(r.evrakTuru) || 'Genel_Klasor';

    let hedefKlasor = '';
    if (klasorModu === 'tek') {
      hedefKlasor = `${anaDosyaAdi}/Tum_Evraklar`;
    } else {
      hedefKlasor = `${anaDosyaAdi}/${evrakKategorisi}`;
    }

    let hamAd = r.baslik || 'evrak';
    let uzanti = '';

    const sonNoktaIndex = hamAd.lastIndexOf('.');
    if (sonNoktaIndex > 0 && sonNoktaIndex >= hamAd.length - 6) {
      uzanti = hamAd.substring(sonNoktaIndex).toLowerCase();
      hamAd = hamAd.substring(0, sonNoktaIndex);
    } else {
      const tip = (r.tipi || '').toLowerCase();

      if (tip === 'pdf') uzanti = '.pdf';
      else if (tip === 'tif' || tip === 'tiff') uzanti = '.tif';
      else if (tip === 'jpg' || tip === 'jpeg') uzanti = '.jpg';
      else if (tip === 'png') uzanti = '.png';
      else if (tip === 'doc' || tip === 'docx') uzanti = `.${tip}`;
      else if (tip === 'xls' || tip === 'xlsx') uzanti = `.${tip}`;
      else {
        uzanti = '.udf';
      }
    }

    let temizAd = temizle(hamAd).replace(/\s+/g, '_');
    let nihaiDosyaAdi = `${temizAd}${uzanti}`;

    if (!klasorDosyaTakibi[hedefKlasor]) {
      klasorDosyaTakibi[hedefKlasor] = new Set();
    }

    let sayac = 1;
    let benzersizAd = nihaiDosyaAdi;
    while (klasorDosyaTakibi[hedefKlasor].has(benzersizAd)) {
      benzersizAd = `${temizAd}_${sayac}${uzanti}`;
      sayac++;
    }
    klasorDosyaTakibi[hedefKlasor].add(benzersizAd);

    await chrome.runtime.sendMessage({
      type: 'sirada-bekleyen',
      klasor: hedefKlasor,
      ad: benzersizAd,
    });

    const ok = await indirEvrakIstek(r.evrakId);
    if (!ok) hatalar.push(r);

    islemGoren++;

    onProgress?.(i + 1, records.length, r);
    await new Promise((res) => setTimeout(res, delayMs));
  }

  return { hatalar, durduruldu: false, yapilan: islemGoren };
}