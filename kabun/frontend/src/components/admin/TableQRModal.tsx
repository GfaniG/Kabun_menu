import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Layers,
  CreditCard,
  Maximize2,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useSiteSettings, useTables } from '../../hooks/useMenu';

interface TableQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTableNumber?: string | null;
  batchMode?: boolean;
}

export const TableQRModal: React.FC<TableQRModalProps> = ({
  isOpen,
  onClose,
  initialTableNumber,
  batchMode = false,
}) => {
  const { data: settings } = useSiteSettings();
  const { data: tables = [] } = useTables();

  const [selectedTable, setSelectedTable] = useState<string>('1');
  const [isBatch, setIsBatch] = useState<boolean>(batchMode);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [standTheme, setStandTheme] = useState<'cream' | 'teal'>('cream');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [batchQRs, setBatchQRs] = useState<Array<{ tableNumber: string; label: string; qrUrl: string }>>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const printCardRef = useRef<HTMLDivElement>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialTableNumber) {
        setSelectedTable(initialTableNumber);
        setIsBatch(false);
      } else if (batchMode) {
        setIsBatch(true);
      } else if (tables.length > 0) {
        setSelectedTable(tables[0].tableNumber);
      }
    }
  }, [isOpen, initialTableNumber, batchMode, tables]);

  // Target URL for single table
  const targetUrl =
    selectedTable === 'master'
      ? `${baseUrl}/?scan=qr`
      : `${baseUrl}/?table=${encodeURIComponent(selectedTable)}`;

  // Generate QR for single selected table
  useEffect(() => {
    if (!isOpen || isBatch) return;

    QRCode.toDataURL(targetUrl, {
      width: 512,
      margin: 1,
      color: {
        dark: '#0E2F2C', // Teal pattern
        light: standTheme === 'cream' ? '#FAF6F0' : '#E5CFAF', // Background
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR:', err));
  }, [isOpen, targetUrl, isBatch, standTheme]);

  // Generate batch QRs for all tables
  useEffect(() => {
    if (!isOpen || !isBatch || tables.length === 0) return;

    const generateAll = async () => {
      const results: Array<{ tableNumber: string; label: string; qrUrl: string }> = [];
      for (const t of tables) {
        const url = `${baseUrl}/?table=${encodeURIComponent(t.tableNumber)}`;
        const qr = await QRCode.toDataURL(url, {
          width: 400,
          margin: 1,
          color: {
            dark: '#0E2F2C',
            light: standTheme === 'cream' ? '#FAF6F0' : '#E5CFAF',
          },
          errorCorrectionLevel: 'H',
        });
        results.push({
          tableNumber: t.tableNumber,
          label: t.label || `Table ${t.tableNumber}`,
          qrUrl: qr,
        });
      }
      setBatchQRs(results);
    };

    generateAll().catch(console.error);
  }, [isOpen, isBatch, tables, baseUrl, standTheme]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `Kabun-Coffee-Table-${selectedTable}-ID-Card-QR.png`;
    a.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    const isCream = standTheme === 'cream';
    const isPortrait = orientation === 'portrait';

    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) {
      window.print();
      return;
    }

    // Standard CR80 ID Card dimensions: 85.6mm x 53.98mm (~86mm x 54mm)
    const cardWidthMm = isPortrait ? '54mm' : '85.6mm';
    const cardHeightMm = isPortrait ? '85.6mm' : '54mm';

    if (isBatch) {
      // Print all tables on A4 with cut guide borders (8 ID cards per A4 page)
      const cardsHtml = batchQRs
        .map((item) => {
          if (isPortrait) {
            return `
              <div class="id-card-wrapper">
                <div class="id-card ${isCream ? 'theme-cream' : 'theme-teal'}">
                  <div class="card-header">
                    <span class="geez-brand">ካቡን &bull; KABUN</span>
                    <span class="sub-brand">COFFEE + ROASTERY</span>
                  </div>

                  <div class="table-pill">
                    TABLE ${item.tableNumber}
                  </div>

                  <div class="qr-container">
                    <img src="${item.qrUrl}" alt="Table ${item.tableNumber} QR" />
                  </div>

                  <div class="card-footer">
                    <strong>SCAN TO ORDER</strong>
                    <span>ይቃኙ እና ያዝዙ</span>
                  </div>
                </div>
              </div>
            `;
          } else {
            return `
              <div class="id-card-wrapper">
                <div class="id-card id-card-landscape ${isCream ? 'theme-cream' : 'theme-teal'}">
                  <div class="left-col">
                    <div class="card-header">
                      <span class="geez-brand">ካቡን &bull; KABUN</span>
                      <span class="sub-brand">COFFEE + ROASTERY</span>
                    </div>
                    <div class="table-pill">
                      TABLE ${item.tableNumber}
                    </div>
                    <div class="card-footer">
                      <strong>SCAN TO ORDER</strong>
                      <span>ይቃኙ እና ያዝዙ</span>
                    </div>
                  </div>
                  <div class="right-col">
                    <div class="qr-container-landscape">
                      <img src="${item.qrUrl}" alt="Table ${item.tableNumber} QR" />
                    </div>
                  </div>
                </div>
              </div>
            `;
          }
        })
        .join('');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Kabun Coffee - All Table ID Cards (Batch Print)</title>
            <style>
              @page {
                size: A4 portrait;
                margin: 8mm 6mm;
              }
              * { box-sizing: border-box; }
              body {
                font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                margin: 0;
                padding: 0;
                background: #ffffff;
                color: #0E2F2C;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .print-grid {
                display: grid;
                grid-template-columns: repeat(${isPortrait ? '3' : '2'}, 1fr);
                gap: 6mm;
                justify-items: center;
                align-items: center;
              }
              .id-card-wrapper {
                break-inside: avoid;
                page-break-inside: avoid;
                padding: 1px;
                border: 1px dashed #d1d5db; /* Crop / cut guide for scissors */
                border-radius: 4.5mm;
              }
              .id-card {
                width: ${cardWidthMm};
                height: ${cardHeightMm};
                border-radius: 4mm;
                padding: 3.5mm 3mm;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                text-align: center;
                overflow: hidden;
              }
              .theme-cream {
                background: #FAF6F0 !important;
                color: #0E2F2C !important;
                border: 1.5px solid #0E2F2C;
              }
              .theme-teal {
                background: #0E2F2C !important;
                color: #FAF7F2 !important;
                border: 1.5px solid #E5CFAF;
              }
              .geez-brand {
                font-size: 8.5pt;
                font-weight: 900;
                letter-spacing: 0.8px;
                display: block;
                line-height: 1.1;
              }
              .sub-brand {
                font-size: 5.5pt;
                letter-spacing: 1px;
                opacity: 0.85;
                font-weight: 700;
                display: block;
                margin-top: 0.5mm;
              }
              .table-pill {
                display: inline-block;
                padding: 1mm 4mm;
                border-radius: 12px;
                font-size: 9pt;
                font-weight: 900;
                letter-spacing: 1px;
                margin: 0.5mm 0;
              }
              .theme-cream .table-pill {
                background: #0E2F2C;
                color: #E5CFAF;
              }
              .theme-teal .table-pill {
                background: #E5CFAF;
                color: #0E2F2C;
              }
              .qr-container {
                width: 33mm;
                height: 33mm;
                background: #ffffff;
                padding: 1.5mm;
                border-radius: 3mm;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 1px 4px rgba(0,0,0,0.1);
              }
              .qr-container img {
                width: 100%;
                height: 100%;
                display: block;
              }
              .card-footer {
                font-size: 6pt;
                line-height: 1.25;
              }
              .card-footer strong {
                display: block;
                letter-spacing: 0.8px;
                font-size: 6.5pt;
              }
              .card-footer span {
                opacity: 0.8;
                font-size: 5.5pt;
              }

              /* Landscape specifics */
              .id-card-landscape {
                flex-direction: row;
                text-align: left;
                padding: 3mm 4mm;
              }
              .id-card-landscape .left-col {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;
                flex: 1;
                padding-right: 2mm;
              }
              .id-card-landscape .right-col {
                width: 35mm;
                height: 35mm;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .qr-container-landscape {
                width: 34mm;
                height: 34mm;
                background: #ffffff;
                padding: 1.5mm;
                border-radius: 3mm;
              }
              .qr-container-landscape img {
                width: 100%;
                height: 100%;
              }
            </style>
          </head>
          <body>
            <div class="print-grid">
              ${cardsHtml}
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() { window.print(); }, 300);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      return;
    }

    // Single card printing
    const selectedObj = tables.find((t) => t.tableNumber === selectedTable);
    const tableLabel =
      selectedTable === 'master'
        ? 'MAIN ROASTERY'
        : selectedObj?.label || `TABLE ${selectedTable}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kabun Coffee - ${tableLabel} ID Card</title>
          <style>
            @page {
              size: auto;
              margin: 15mm;
            }
            * { box-sizing: border-box; }
            body {
              font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: #ffffff;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .id-card-wrapper {
              padding: 1px;
              border: 1px dashed #bbb; /* Standard scissor cut line */
              border-radius: 4.5mm;
              display: inline-block;
            }
            .id-card {
              width: ${cardWidthMm};
              height: ${cardHeightMm};
              border-radius: 4mm;
              padding: 4mm 3.5mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              text-align: center;
            }
            .theme-cream {
              background: #FAF6F0 !important;
              color: #0E2F2C !important;
              border: 2px solid #0E2F2C;
            }
            .theme-teal {
              background: #0E2F2C !important;
              color: #FAF7F2 !important;
              border: 2px solid #E5CFAF;
            }
            .geez-brand {
              font-size: 9.5pt;
              font-weight: 900;
              letter-spacing: 0.8px;
              display: block;
              line-height: 1.1;
            }
            .sub-brand {
              font-size: 6pt;
              letter-spacing: 1.2px;
              opacity: 0.85;
              font-weight: 700;
              display: block;
              margin-top: 0.5mm;
            }
            .table-pill {
              display: inline-block;
              padding: 1.2mm 5mm;
              border-radius: 14px;
              font-size: 10pt;
              font-weight: 900;
              letter-spacing: 1px;
            }
            .theme-cream .table-pill {
              background: #0E2F2C;
              color: #E5CFAF;
            }
            .theme-teal .table-pill {
              background: #E5CFAF;
              color: #0E2F2C;
            }
            .qr-container {
              width: 35mm;
              height: 35mm;
              background: #ffffff;
              padding: 2mm;
              border-radius: 3mm;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 1px 6px rgba(0,0,0,0.15);
            }
            .qr-container img {
              width: 100%;
              height: 100%;
              display: block;
            }
            .card-footer {
              font-size: 6.5pt;
              line-height: 1.25;
            }
            .card-footer strong {
              display: block;
              letter-spacing: 1px;
              font-size: 7pt;
            }
            .card-footer span {
              opacity: 0.8;
              font-size: 6pt;
            }

            /* Landscape format */
            .id-card-landscape {
              flex-direction: row;
              text-align: left;
              padding: 4mm 5mm;
            }
            .id-card-landscape .left-col {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              height: 100%;
              flex: 1;
              padding-right: 3mm;
            }
            .id-card-landscape .right-col {
              width: 36mm;
              height: 36mm;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .qr-container-landscape {
              width: 35mm;
              height: 35mm;
              background: #ffffff;
              padding: 2mm;
              border-radius: 3mm;
            }
            .qr-container-landscape img {
              width: 100%;
              height: 100%;
            }
          </style>
        </head>
        <body>
          <div class="id-card-wrapper">
            ${
              isPortrait
                ? `
              <div class="id-card ${isCream ? 'theme-cream' : 'theme-teal'}">
                <div class="card-header">
                  <span class="geez-brand">ካቡን &bull; KABUN</span>
                  <span class="sub-brand">COFFEE + ROASTERY</span>
                </div>

                <div class="table-pill">
                  ${tableLabel.toUpperCase()}
                </div>

                <div class="qr-container">
                  <img src="${qrDataUrl}" alt="${tableLabel} QR" />
                </div>

                <div class="card-footer">
                  <strong>SCAN TO ORDER</strong>
                  <span>ይቃኙ እና ያዝዙ</span>
                </div>
              </div>
            `
                : `
              <div class="id-card id-card-landscape ${isCream ? 'theme-cream' : 'theme-teal'}">
                <div class="left-col">
                  <div class="card-header">
                    <span class="geez-brand">ካቡን &bull; KABUN</span>
                    <span class="sub-brand">COFFEE + ROASTERY</span>
                  </div>
                  <div class="table-pill">
                    ${tableLabel.toUpperCase()}
                  </div>
                  <div class="card-footer">
                    <strong>SCAN TO ORDER</strong>
                    <span>ይቃኙ እና ያዝዙ</span>
                  </div>
                </div>
                <div class="right-col">
                  <div class="qr-container-landscape">
                    <img src="${qrDataUrl}" alt="${tableLabel} QR" />
                  </div>
                </div>
              </div>
            `
            }
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 300);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isBatch ? 'Print All Table ID Cards' : `Table ${selectedTable} QR ID Card`}
      subtitle="Standard CR80 ID-Card size (85.6mm × 54mm) for acrylic table holders and plastic sleeves"
      maxWidth={isBatch ? '2xl' : 'lg'}
    >
      <div className="space-y-5">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-xl bg-[#0B2523] border border-[#1D4D47]">
          {/* Mode Switch: Single vs Batch */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsBatch(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold uppercase tracking-wider transition-all ${
                !isBatch ? 'bg-[#E5CFAF] text-[#0E2F2C]' : 'text-[#C5D5D3] hover:text-white'
              }`}
            >
              Single Card
            </button>
            <button
              onClick={() => setIsBatch(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                isBatch ? 'bg-[#E5CFAF] text-[#0E2F2C]' : 'text-[#C5D5D3] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Batch All ({tables.length})</span>
            </button>
          </div>

          {/* Orientation: Portrait vs Landscape */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setOrientation('portrait')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                orientation === 'portrait' ? 'bg-[#143B37] text-white border border-[#E5CFAF]' : 'text-[#A2B8B5]'
              }`}
              title="Portrait (Vertical 54x85.6mm)"
            >
              Vertical Badge
            </button>
            <button
              onClick={() => setOrientation('landscape')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                orientation === 'landscape' ? 'bg-[#143B37] text-white border border-[#E5CFAF]' : 'text-[#A2B8B5]'
              }`}
              title="Landscape (Horizontal 85.6x54mm)"
            >
              Horizontal Card
            </button>
          </div>

          {/* Table select dropdown if in Single Mode */}
          {!isBatch && (
            <div className="flex items-center gap-1.5">
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="bg-[#133834] border border-[#1D4D47] text-white text-xs font-headline font-bold uppercase tracking-wider rounded-lg px-2.5 py-1.5 focus:border-[#E5CFAF] outline-none"
              >
                <option value="master">Master QR (Generic)</option>
                {tables.map((t) => (
                  <option key={t.id} value={t.tableNumber}>
                    {t.label || `Table ${t.tableNumber}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Color theme: Cream vs Teal */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setStandTheme('cream')}
              className={`px-2 py-1 rounded text-xs font-bold ${
                standTheme === 'cream' ? 'bg-[#FAF6F0] text-[#0E2F2C]' : 'text-[#A2B8B5]'
              }`}
            >
              Cream
            </button>
            <button
              onClick={() => setStandTheme('teal')}
              className={`px-2 py-1 rounded text-xs font-bold ${
                standTheme === 'teal' ? 'bg-[#0E2F2C] text-[#E5CFAF] border border-[#1D4D47]' : 'text-[#A2B8B5]'
              }`}
            >
              Teal
            </button>
          </div>
        </div>

        {/* Preview Container */}
        {isBatch ? (
          <div className="space-y-3">
            <div className="p-3 bg-[#0B2523] rounded-xl border border-[#1D4D47] flex items-center justify-between text-xs text-[#C5D5D3]">
              <span>
                Standard ID card format (<strong>85.6mm × 54mm</strong>). Fits standard plastic badge sleeves & mini acrylic table clips.
              </span>
              <span className="font-mono text-[#E5CFAF] font-bold">{tables.length} Cards Total</span>
            </div>

            <div className="max-h-[360px] overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-3 p-2 bg-[#0B2523] rounded-xl border border-[#1D4D47]">
              {batchQRs.map((item) => (
                <div
                  key={item.tableNumber}
                  className={`rounded-xl p-2.5 text-center flex flex-col justify-between items-center border ${
                    standTheme === 'cream'
                      ? 'bg-[#FAF6F0] text-[#0E2F2C] border-[#0E2F2C]'
                      : 'bg-[#0E2F2C] text-white border-[#E5CFAF]'
                  }`}
                  style={{ minHeight: '140px' }}
                >
                  <span className="text-[9px] font-black uppercase tracking-wider block">
                    KABUN &bull; ROASTERY
                  </span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase my-1 ${
                      standTheme === 'cream' ? 'bg-[#0E2F2C] text-[#E5CFAF]' : 'bg-[#E5CFAF] text-[#0E2F2C]'
                    }`}
                  >
                    TABLE {item.tableNumber}
                  </span>
                  <div className="w-16 h-16 bg-white p-1 rounded-md shadow-sm">
                    <img src={item.qrUrl} alt={item.label} className="w-full h-full" />
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-tight block mt-1">
                    Scan to Order
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            {/* Single ID Card Preview */}
            <div className="p-1 rounded-2xl border border-dashed border-[#A2B8B5]/50 bg-[#0B2523] shadow-lg">
              <div
                ref={printCardRef}
                className={`rounded-xl p-3.5 flex flex-col justify-between items-center text-center transition-all shadow-xl ${
                  standTheme === 'cream'
                    ? 'bg-[#FAF6F0] text-[#0E2F2C] border-2 border-[#0E2F2C]'
                    : 'bg-[#0E2F2C] text-[#FAF7F2] border-2 border-[#E5CFAF]'
                }`}
                style={{
                  width: orientation === 'portrait' ? '180px' : '260px',
                  height: orientation === 'portrait' ? '280px' : '176px', // Scaled preview matching 85.6mm x 54mm ID ratio
                }}
              >
                {orientation === 'portrait' ? (
                  <>
                    <div className="space-y-0.5">
                      <span className="font-headline text-[10.5px] font-black uppercase tracking-wider block leading-tight">
                        ካቡን &bull; KABUN
                      </span>
                      <span className="text-[7px] uppercase tracking-widest block opacity-75 font-bold">
                        COFFEE + ROASTERY
                      </span>
                    </div>

                    <span
                      className={`inline-block px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        standTheme === 'cream'
                          ? 'bg-[#0E2F2C] text-[#E5CFAF]'
                          : 'bg-[#E5CFAF] text-[#0E2F2C]'
                      }`}
                    >
                      {selectedTable === 'master' ? 'MAIN ROASTERY' : `TABLE ${selectedTable}`}
                    </span>

                    {qrDataUrl && (
                      <div className="w-28 h-28 bg-white p-1.5 rounded-xl shadow-inner flex items-center justify-center">
                        <img src={qrDataUrl} alt="Table QR" className="w-full h-full object-contain" />
                      </div>
                    )}

                    <div className="text-[8px] leading-tight space-y-0.5">
                      <strong className="block uppercase tracking-wider">SCAN TO ORDER</strong>
                      <span className="opacity-80">ይቃኙ እና ያዝዙ</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between w-full h-full gap-2 text-left">
                    <div className="flex flex-col justify-between h-full py-1">
                      <div className="space-y-0.5">
                        <span className="font-headline text-[10px] font-black uppercase tracking-wider block leading-tight">
                          ካቡን &bull; KABUN
                        </span>
                        <span className="text-[7px] uppercase tracking-widest block opacity-75 font-bold">
                          COFFEE + ROASTERY
                        </span>
                      </div>

                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-center ${
                          standTheme === 'cream'
                            ? 'bg-[#0E2F2C] text-[#E5CFAF]'
                            : 'bg-[#E5CFAF] text-[#0E2F2C]'
                        }`}
                      >
                        {selectedTable === 'master' ? 'MAIN ROASTERY' : `TABLE ${selectedTable}`}
                      </span>

                      <div className="text-[7.5px] leading-tight">
                        <strong className="block uppercase tracking-wider">SCAN TO ORDER</strong>
                        <span className="opacity-80">ይቃኙ እና ያዝዙ</span>
                      </div>
                    </div>

                    {qrDataUrl && (
                      <div className="w-28 h-28 bg-white p-1.5 rounded-xl shadow-inner flex items-center justify-center shrink-0">
                        <img src={qrDataUrl} alt="Table QR" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Side Information */}
            <div className="flex-1 space-y-3 max-w-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#E5CFAF] font-headline font-bold uppercase tracking-wider">
                  <CreditCard className="w-4 h-4" />
                  <span>CR80 Standard ID Card Size</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0B2523] border border-[#1D4D47] text-xs font-mono text-white">
                  <strong>85.6 mm × 54.0 mm</strong> (3.375" × 2.125")
                </div>
              </div>

              <p className="text-xs text-[#C5D5D3] leading-relaxed">
                Formatted specifically to the physical size of an ID card with scissor cut guidelines. Perfect for table clips, acrylic mini-holders, or PVC card printing.
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopy}
                  leftIcon={copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  className="w-full justify-center text-xs"
                >
                  {copiedLink ? 'Link Copied!' : 'Copy Table Link'}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDownload}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  className="w-full justify-center text-xs"
                >
                  Download ID Card Image
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1D4D47]">
          <Button variant="secondary" onClick={onClose} className="text-xs">
            Close
          </Button>
          <Button
            variant="yellow"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4 text-[#0E2F2C]" />}
            className="font-bold text-xs"
          >
            {isBatch ? `Print All ${tables.length} ID Cards (A4 Sheet)` : `Print Table ${selectedTable} ID Card`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
