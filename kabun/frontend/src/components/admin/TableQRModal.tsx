import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Printer, Copy, Check, ExternalLink, Wifi, Layers } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { KabunLogo } from '../common/KabunLogo';
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
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [batchQRs, setBatchQRs] = useState<Array<{ tableNumber: string; label: string; qrUrl: string }>>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [standTheme, setStandTheme] = useState<'cream' | 'teal'>('cream');
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
  const targetUrl = selectedTable === 'master'
    ? `${baseUrl}/?scan=qr`
    : `${baseUrl}/?table=${encodeURIComponent(selectedTable)}`;

  // Generate QR for single selected table
  useEffect(() => {
    if (!isOpen || isBatch) return;

    QRCode.toDataURL(targetUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: '#0E2F2C', // Teal QR pattern
        light: '#E5CFAF', // Warm Roasted Oat Cream background
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR:', err));
  }, [isOpen, targetUrl, isBatch]);

  // Generate batch QRs for all tables
  useEffect(() => {
    if (!isOpen || !isBatch || tables.length === 0) return;

    const generateAll = async () => {
      const results: Array<{ tableNumber: string; label: string; qrUrl: string }> = [];
      for (const t of tables) {
        const url = `${baseUrl}/?table=${encodeURIComponent(t.tableNumber)}`;
        const qr = await QRCode.toDataURL(url, {
          width: 384,
          margin: 2,
          color: {
            dark: '#0E2F2C',
            light: '#E5CFAF',
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
  }, [isOpen, isBatch, tables, baseUrl]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `Kabun-Coffee-Table-${selectedTable}-QR.png`;
    a.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    const wifiSsid = settings?.wifiSsid || 'Kabun_Guest_WiFi';
    const wifiPassword = settings?.wifiPassword || 'craftedfromcoffee';
    const isCream = standTheme === 'cream';

    const printWindow = window.open('', '_blank', 'width=850,height=1100');
    if (!printWindow) {
      window.print();
      return;
    }

    if (isBatch) {
      // Print all tables in a 2-up grid per page
      const cardsHtml = batchQRs
        .map(
          (item) => `
        <div class="acrylic-card">
          <div class="brand-top">
            <span class="brand-name">KABUN COFFEE + ROASTERY</span>
            <span class="brand-tagline">CRAFTED FROM COFFEE</span>
          </div>

          <div class="table-badge">
            TABLE ${item.tableNumber}
          </div>

          <div class="qr-box">
            <img src="${item.qrUrl}" alt="Table ${item.tableNumber} QR" />
          </div>

          <div class="instruction">
            <strong>SCAN WITH PHONE</strong><br>
            <span>To Order Drinks, Pastries & Call Barista</span>
          </div>

          <div class="wifi-pill">
            <span class="wifi-label">GUEST WI-FI</span>
            <span class="wifi-value">${wifiSsid}</span>
            <span class="wifi-pass">PW: ${wifiPassword}</span>
          </div>
        </div>
      `
        )
        .join('');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Kabun Coffee - Batch Table QR Stands</title>
            <style>
              @page { size: A4; margin: 8mm; }
              * { box-sizing: border-box; }
              body {
                font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                margin: 0;
                background: #ffffff;
                color: #0E2F2C;
              }
              .grid-container {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
                padding: 10px;
              }
              .acrylic-card {
                background: ${isCream ? '#FAF6F0' : '#0E2F2C'} !important;
                color: ${isCream ? '#0E2F2C' : '#FAF7F2'} !important;
                border: 2.5px solid ${isCream ? '#0E2F2C' : '#E5CFAF'};
                border-radius: 20px;
                padding: 16px 14px;
                text-align: center;
                break-inside: avoid;
                page-break-inside: avoid;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .brand-name {
                font-size: 11px;
                font-weight: 900;
                letter-spacing: 2px;
                display: block;
                color: ${isCream ? '#0E2F2C' : '#E5CFAF'};
              }
              .brand-tagline {
                font-size: 8px;
                letter-spacing: 1.5px;
                opacity: 0.8;
                display: block;
                margin-top: 2px;
              }
              .table-badge {
                display: inline-block;
                background: ${isCream ? '#0E2F2C' : '#E5CFAF'};
                color: ${isCream ? '#E5CFAF' : '#0E2F2C'};
                font-size: 14px;
                font-weight: 900;
                letter-spacing: 1.5px;
                padding: 4px 14px;
                border-radius: 20px;
                margin: 10px 0 6px;
              }
              .qr-box {
                background: #E5CFAF;
                padding: 8px;
                border-radius: 12px;
                display: inline-block;
                margin: 4px auto;
              }
              .qr-box img {
                width: 130px;
                height: 130px;
                display: block;
              }
              .instruction {
                font-size: 9px;
                margin-top: 6px;
                line-height: 1.3;
              }
              .wifi-pill {
                margin-top: 8px;
                padding: 4px 8px;
                background: ${isCream ? '#EDE2D1' : '#143B37'};
                border-radius: 8px;
                font-size: 8px;
                line-height: 1.2;
              }
              .wifi-label {
                font-weight: 800;
                letter-spacing: 1px;
                color: ${isCream ? '#0E2F2C' : '#E5CFAF'};
                display: block;
              }
              .wifi-value, .wifi-pass {
                font-family: monospace;
                display: block;
              }
            </style>
          </head>
          <body>
            <div class="grid-container">
              ${cardsHtml}
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 300);
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
    const tableLabel = selectedTable === 'master' ? 'MAIN ROASTERY' : (selectedObj?.label || `TABLE ${selectedTable}`);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kabun Coffee - ${tableLabel} QR Stand</title>
          <style>
            @page { size: auto; margin: 10mm; }
            * { box-sizing: border-box; }
            body {
              font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: #ffffff;
            }
            .acrylic-card {
              width: 320px;
              background: ${isCream ? '#FAF6F0' : '#0E2F2C'} !important;
              color: ${isCream ? '#0E2F2C' : '#FAF7F2'} !important;
              border: 3px solid ${isCream ? '#0E2F2C' : '#E5CFAF'};
              border-radius: 26px;
              padding: 24px 20px;
              text-align: center;
              box-shadow: 0 10px 40px rgba(0,0,0,0.15);
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .brand-name {
              font-size: 13px;
              font-weight: 900;
              letter-spacing: 2.5px;
              color: ${isCream ? '#0E2F2C' : '#E5CFAF'};
              display: block;
            }
            .brand-tagline {
              font-size: 9px;
              letter-spacing: 2px;
              opacity: 0.8;
              display: block;
              margin-top: 2px;
            }
            .table-badge {
              display: inline-block;
              background: ${isCream ? '#0E2F2C' : '#E5CFAF'};
              color: ${isCream ? '#E5CFAF' : '#0E2F2C'};
              font-size: 16px;
              font-weight: 900;
              letter-spacing: 2px;
              padding: 5px 18px;
              border-radius: 24px;
              margin: 14px 0 10px;
            }
            .qr-box {
              background: #E5CFAF;
              padding: 10px;
              border-radius: 16px;
              display: inline-block;
              margin: 6px auto;
            }
            .qr-box img {
              width: 170px;
              height: 170px;
              display: block;
            }
            .instruction {
              font-size: 11px;
              margin-top: 10px;
              line-height: 1.4;
            }
            .wifi-box {
              margin-top: 14px;
              padding: 8px 12px;
              background: ${isCream ? '#EDE2D1' : '#143B37'};
              border-radius: 12px;
              font-size: 10px;
            }
            .wifi-label {
              font-weight: 800;
              letter-spacing: 1.5px;
              color: ${isCream ? '#0E2F2C' : '#E5CFAF'};
              display: block;
            }
            .wifi-val {
              font-family: monospace;
              display: block;
              margin-top: 2px;
            }
          </style>
        </head>
        <body>
          <div class="acrylic-card">
            <span class="brand-name">KABUN COFFEE + ROASTERY</span>
            <span class="brand-tagline">CRAFTED FROM COFFEE</span>

            <div class="table-badge">
              ${tableLabel.toUpperCase()}
            </div>

            <div class="qr-box">
              <img src="${qrDataUrl}" alt="${tableLabel} QR" />
            </div>

            <div class="instruction">
              <strong>SCAN WITH YOUR SMARTPHONE</strong><br>
              <span>Explore Menu &bull; Order Drinks &bull; Call Barista</span>
            </div>

            <div class="wifi-box">
              <span class="wifi-label">COMPLIMENTARY GUEST WI-FI</span>
              <span class="wifi-val">${wifiSsid} &bull; PW: ${wifiPassword}</span>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const wifiSsid = settings?.wifiSsid || 'Kabun_Guest_WiFi';
  const wifiPassword = settings?.wifiPassword || 'craftedfromcoffee';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isBatch ? 'Batch Print All Table QR Stands' : `Table ${selectedTable} QR Stand Card`}
      subtitle="High-resolution QR table stand cards with automatic ordering and waiter call links"
      maxWidth={isBatch ? '2xl' : 'lg'}
    >
      <div className="space-y-5">
        {/* Selector & Mode Switch */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#0B2523] border border-[#1D4D47]">
          {/* Mode toggle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsBatch(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold uppercase tracking-wider transition-all ${
                !isBatch ? 'bg-[#E5CFAF] text-[#0E2F2C]' : 'text-[#C5D5D3] hover:text-white'
              }`}
            >
              Single Table
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

          {/* Table select dropdown if in Single Mode */}
          {!isBatch && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#C5D5D3] uppercase tracking-wider font-bold">Select Table:</span>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="bg-[#133834] border border-[#1D4D47] text-white text-xs font-headline font-bold uppercase tracking-wider rounded-lg px-2.5 py-1.5 focus:border-[#E5CFAF] outline-none"
              >
                <option value="master">Master QR (Generic / All Tables)</option>
                {tables.map((t) => (
                  <option key={t.id} value={t.tableNumber}>
                    {t.label || `Table ${t.tableNumber}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Theme Switcher for Stand */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#C5D5D3]">Card Theme:</span>
            <button
              onClick={() => setStandTheme('cream')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                standTheme === 'cream' ? 'bg-[#FAF6F0] text-[#0E2F2C]' : 'text-[#C5D5D3]'
              }`}
            >
              Cream
            </button>
            <button
              onClick={() => setStandTheme('teal')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                standTheme === 'teal' ? 'bg-[#0E2F2C] text-[#E5CFAF] border border-[#1D4D47]' : 'text-[#C5D5D3]'
              }`}
            >
              Teal
            </button>
          </div>
        </div>

        {/* Preview Container */}
        {isBatch ? (
          <div className="space-y-3">
            <p className="text-xs text-[#C5D5D3]">
              Generating QR codes for all <strong>{tables.length} tables</strong>. Clicking <em>"Print All Stand Cards"</em> will print them 2-per-page formatted for acrylic table tents or counter cardstock.
            </p>
            <div className="max-h-[360px] overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 p-2 bg-[#0B2523] rounded-xl border border-[#1D4D47]">
              {batchQRs.map((item) => (
                <div
                  key={item.tableNumber}
                  className="bg-[#133834] border border-[#1D4D47] rounded-xl p-3 text-center space-y-1.5"
                >
                  <span className="px-2 py-0.5 rounded-full bg-[#E5CFAF] text-[#0E2F2C] text-[10px] font-black uppercase">
                    TABLE {item.tableNumber}
                  </span>
                  <div className="w-20 h-20 mx-auto bg-[#E5CFAF] p-1 rounded-lg">
                    <img src={item.qrUrl} alt={item.label} className="w-full h-full" />
                  </div>
                  <span className="text-[10px] text-[#A2B8B5] block truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            {/* Stand Card Preview */}
            <div
              ref={printCardRef}
              className={`w-64 rounded-2xl p-5 text-center space-y-3 border-2 transition-all shadow-xl ${
                standTheme === 'cream'
                  ? 'bg-[#FAF6F0] text-[#0E2F2C] border-[#0E2F2C]'
                  : 'bg-[#0E2F2C] text-[#FAF7F2] border-[#E5CFAF]'
              }`}
            >
              <div>
                <span className="font-headline text-[11px] font-black uppercase tracking-widest block">
                  KABUN COFFEE + ROASTERY
                </span>
                <span className="text-[8px] uppercase tracking-wider block opacity-75">
                  CRAFTED FROM COFFEE
                </span>
              </div>

              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                  standTheme === 'cream' ? 'bg-[#0E2F2C] text-[#E5CFAF]' : 'bg-[#E5CFAF] text-[#0E2F2C]'
                }`}
              >
                {selectedTable === 'master' ? 'MAIN ROASTERY' : `TABLE ${selectedTable}`}
              </span>

              {qrDataUrl && (
                <div className="w-40 h-40 mx-auto bg-[#E5CFAF] p-2 rounded-xl shadow-inner">
                  <img src={qrDataUrl} alt="Table QR" className="w-full h-full" />
                </div>
              )}

              <div className="text-[10px] leading-tight space-y-0.5">
                <strong className="block uppercase tracking-wider">Scan with Phone</strong>
                <span className="opacity-80">Order Drinks &bull; Call Barista</span>
              </div>

              <div
                className={`p-2 rounded-xl text-[9px] ${
                  standTheme === 'cream' ? 'bg-[#EDE2D1]' : 'bg-[#143B37]'
                }`}
              >
                <div className="flex items-center justify-center gap-1 font-bold">
                  <Wifi className="w-3 h-3" />
                  <span>WI-FI: {wifiSsid}</span>
                </div>
                <div className="font-mono opacity-80">PW: {wifiPassword}</div>
              </div>
            </div>

            {/* Side Information */}
            <div className="flex-1 space-y-3 max-w-xs">
              <div className="space-y-1">
                <h4 className="font-headline text-sm font-bold text-white uppercase tracking-wider">
                  Target Customer URL:
                </h4>
                <div className="p-2.5 rounded-xl bg-[#0B2523] border border-[#1D4D47] text-xs font-mono text-[#E5CFAF] break-all">
                  {targetUrl}
                </div>
              </div>

              <p className="text-xs text-[#C5D5D3] leading-relaxed">
                When seated customers scan this QR code, their phone automatically locks to{' '}
                <strong className="text-white">Table {selectedTable}</strong>. Any items they order or assistance calls go directly to the Cashier desktop!
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopy}
                  leftIcon={copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  className="w-full justify-center"
                >
                  {copiedLink ? 'Link Copied!' : 'Copy Table Link'}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDownload}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  className="w-full justify-center"
                >
                  Download PNG
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1D4D47]">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="yellow"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4 text-[#0E2F2C]" />}
            className="font-bold"
          >
            {isBatch ? `Print All ${tables.length} Stand Cards` : `Print Table ${selectedTable} Stand`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
