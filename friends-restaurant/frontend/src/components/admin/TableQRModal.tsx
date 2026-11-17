import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Printer, Copy, Check, ExternalLink, Wifi } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { KabunLogo } from '../common/KabunLogo';
import { useSiteSettings } from '../../hooks/useMenu';

interface TableQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableQRModal: React.FC<TableQRModalProps> = ({ isOpen, onClose }) => {
  const { data: settings } = useSiteSettings();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const printCardRef = useRef<HTMLDivElement>(null);

  // Single unified URL for all dining tables and guest scans
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const targetUrl = `${baseUrl}/?scan=qr`;

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(targetUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: '#0E2F2C',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR:', err));
  }, [isOpen, targetUrl]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `Kabun-Coffee-Official-Menu-QR.png`;
    a.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    const cardEl = printCardRef.current;
    if (!cardEl) {
      window.print();
      return;
    }

    const printWindow = window.open('', '_blank', 'width=700,height=950');
    if (!printWindow) {
      window.print();
      return;
    }

    const wifiSsid = settings?.wifiSsid || 'Kabun_Guest_WiFi';
    const wifiPassword = settings?.wifiPassword || 'craftedfromcoffee';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kabun Coffee + Roastery - Official Table QR Stand</title>
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
              color: #0E2F2C;
            }
            .acrylic-card {
              width: 330px;
              background-color: #0E2F2C !important;
              color: #FAF7F2 !important;
              border: 3px solid #E5CFAF;
              border-radius: 28px;
              padding: 28px 24px;
              text-align: center;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            }
            .emblem-wrapper {
              width: 64px;
              height: 64px;
              margin: 0 auto 8px;
              border-radius: 50%;
              overflow: hidden;
              border: 2px solid #E5CFAF;
              background: #0E2F2C;
            }
            .emblem-wrapper img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            .geez-title {
              font-size: 26px;
              font-weight: 900;
              color: #FAF7F2;
              line-height: 1.1;
              letter-spacing: 2px;
              margin: 0;
            }
            .brand-name {
              font-size: 13px;
              font-weight: 800;
              letter-spacing: 3px;
              text-transform: uppercase;
              color: #E5CFAF;
              margin: 2px 0 1px;
            }
            .brand-sub {
              font-size: 9px;
              font-weight: 600;
              letter-spacing: 2px;
              color: #C5D5D3;
              text-transform: uppercase;
              margin-bottom: 12px;
            }
            .badge {
              display: inline-block;
              background-color: #E5CFAF !important;
              color: #0E2F2C !important;
              font-size: 9.5px;
              font-weight: 900;
              letter-spacing: 1.5px;
              text-transform: uppercase;
              padding: 6px 14px;
              border-radius: 999px;
              margin-bottom: 14px;
            }
            .qr-wrapper {
              background: #ffffff !important;
              padding: 12px;
              border-radius: 20px;
              display: inline-block;
              margin-bottom: 12px;
              border: 2px solid #E5CFAF;
            }
            .qr-wrapper img {
              width: 175px;
              height: 175px;
              display: block;
            }
            .instructions {
              font-size: 12px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #FAF7F2;
              margin: 0 0 3px;
            }
            .sub-instructions {
              font-size: 9px;
              color: #C5D5D3;
              margin: 0 0 14px;
              font-style: italic;
            }
            .wifi-box {
              background-color: #133834 !important;
              border: 1px solid #1D4D47;
              border-radius: 14px;
              padding: 10px 12px;
              font-size: 10px;
              color: #C5D5D3;
              text-align: center;
            }
            .wifi-header {
              font-weight: 800;
              color: #FAF7F2;
              margin-bottom: 3px;
              text-transform: uppercase;
              font-size: 9px;
              letter-spacing: 1px;
            }
            .wifi-line {
              font-family: monospace;
              font-size: 10px;
              margin: 2px 0;
            }
            .highlight { color: #E5CFAF; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="acrylic-card">
            <div class="emblem-wrapper">
              <img src="/assets/kabun/kabun-emblem-dark.png" alt="Kabun Logo" />
            </div>
            <div class="geez-title">ካቡን</div>
            <div class="brand-name">KABUN COFFEE + ROASTERY</div>
            <div class="brand-sub">MEKELLE &bull; ETHIOPIA</div>
            <div>
              <span class="badge">Crafted from coffee &bull; Scan for Menu &amp; Wi-Fi</span>
            </div>
            <div class="qr-wrapper">
              <img src="${qrDataUrl}" alt="Menu QR Code" />
            </div>
            <p class="instructions">Scan to Explore Roastery Menu</p>
            <p class="sub-instructions">Single-Origin Roasts &bull; Specialty Cold Brew &bull; Viennoiserie</p>
            <div class="wifi-box">
              <div class="wifi-header">Complimentary Guest Wi-Fi</div>
              <div class="wifi-line">SSID: <strong>${wifiSsid}</strong></div>
              <div class="wifi-line">Password: <span class="highlight">${wifiPassword}</span></div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() { window.close(); }, 500);
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
      title={
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-[#E5CFAF]" />
          <span>Official Roastery Master QR Stand</span>
        </div>
      }
      subtitle="Print this single master QR card for tables, counters, and roastery stands"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Printable Table Tent Preview Card */}
        <div className="flex justify-center">
          <div
            ref={printCardRef}
            className="w-full max-w-xs bg-[#0E2F2C] text-[#FAF7F2] p-6 rounded-3xl shadow-2xl border-2 border-[#E5CFAF] text-center space-y-3.5"
          >
            {/* Kabun Circular Emblem */}
            <div className="flex justify-center pt-1">
              <KabunLogo variant="emblem" className="w-16 h-16 mx-auto" />
            </div>

            <div>
              <h2 className="font-headline font-black text-2xl text-[#FAF7F2] tracking-wider leading-none">
                ካቡን
              </h2>
              <p className="font-headline font-extrabold text-xs text-[#E5CFAF] tracking-[0.25em] uppercase mt-0.5">
                KABUN COFFEE + ROASTERY
              </p>
            </div>

            <div className="py-0.5">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#E5CFAF] text-[#0E2F2C] text-[10px] font-headline font-black tracking-wider uppercase shadow-[0_0_12px_rgba(229,207,175,0.4)]">
                Crafted from coffee &bull; Scan for Menu &amp; Wi-Fi
              </span>
            </div>

            {/* High-Resolution QR Code */}
            <div className="p-3 bg-white rounded-2xl inline-block shadow-lg border-2 border-[#E5CFAF]">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Official Kabun Coffee Menu QR Code"
                  className="w-44 h-44 mx-auto object-contain"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-zinc-400 text-xs">
                  Generating QR...
                </div>
              )}
            </div>

            <div className="space-y-0.5">
              <p className="font-headline text-xs font-extrabold text-[#FAF7F2] uppercase tracking-wider">
                Scan with any Smartphone Camera
              </p>
              <p className="text-[10px] text-[#C5D5D3] italic">
                Single-Origin Roasts &bull; Cold Brew &bull; Fresh Viennoiserie
              </p>
            </div>

            {/* Dynamic Wi-Fi callout at bottom of table card */}
            <div className="pt-2.5 border-t border-[#1D4D47] text-[10px] text-[#C5D5D3] space-y-1 bg-[#133834] rounded-xl p-2.5">
              <div className="flex items-center justify-center gap-1.5 text-[#FAF7F2] font-semibold">
                <Wifi className="w-3.5 h-3.5 text-[#E5CFAF]" />
                <span>Complimentary Guest Wi-Fi</span>
              </div>
              <p className="font-mono text-[#FAF7F2]">
                Network: <span className="text-white font-bold">{settings?.wifiSsid || 'Kabun_Guest_WiFi'}</span>
              </p>
              <p className="font-mono text-[#FAF7F2]">
                Password: <span className="text-[#E5CFAF] font-bold">{settings?.wifiPassword || 'craftedfromcoffee'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Target link display & Copy */}
        <div className="bg-[#0B2523] border border-[#1D4D47] rounded-xl p-3 flex items-center justify-between gap-2">
          <div className="truncate text-xs text-[#C5D5D3] font-mono">
            {targetUrl}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-[#133834] hover:bg-[#18423D] text-[#FAF7F2] transition-colors flex items-center gap-1 text-xs cursor-pointer"
              title="Copy URL"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
            <a
              href={targetUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-[#133834] hover:bg-[#18423D] text-[#FAF7F2] transition-colors"
              title="Open Link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 border-t border-[#1D4D47]">
          <Button variant="secondary" onClick={handleDownload} leftIcon={<Download className="w-4 h-4" />}>
            Download High-Res PNG
          </Button>
          <Button variant="yellow" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            Print Stand Card
          </Button>
        </div>
      </div>
    </Modal>
  );
};
