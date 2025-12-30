'use client';

import { useWeighing } from '@/hooks/useWeighing';

interface OutDocumentPrintSusutNettoTemplateProps {
  onPrint?: () => void;
}

export default function OutDocumentPrintSusutNettoTemplate({
  onPrint,
}: OutDocumentPrintSusutNettoTemplateProps) {
  const { currentBatch } = useWeighing();

  if (!currentBatch) return null;

  const { inbound, document } = currentBatch;
  const weighOut = inbound?.weighOut;
  const weighIn = inbound?.weighIn;

  // Calculate netto and shrinkage
  const nettoSupplier = weighOut?.expected_netto || 0;
  const nettoEvyap = weighOut?.netto || 0;
  const shrinkagePercent = weighOut?.shrinkage_percent || 0.2;

  const handlePrint = () => {
    window.print();
    onPrint?.();
  };

  return (
    <div className="bg-white print:p-0 print-content print:max-w-none print:w-full print:h-full">
      {/* Header - Hidden in print */}

      {/* Main Content Table - Only this prints */}
      <table
        className="w-full border-2 border-black print:mt-0 print:table-fixed"
        key={'table-print'}
      >
        <tbody>
          {/* Company Header Row */}
          <tr>
            <td className="border border-black w-1/5 p-2">
              <div className="flex flex-col items-center justify-center h-full">
                <img
                  src="/images/logo_B.png"
                  alt="Evyap Life Chemistry Logo"
                  className="w-16 h-12 object-contain"
                />
              </div>
            </td>
            <td className="border border-black w-3/5 p-2 text-center">
              <div className="font-bold text-lg">PT. EVYAP SABUN INDONESIA</div>
              <div className="text-sm mt-1">
                Jl. Kelapa Sawit I No. 1 Kawasan Sei Mangkei, Bosar Maligas, Simalungun
                <br />
                Sumatera Utara, Indonesia
              </div>
            </td>
            <td className="border border-black w-1/5 p-2">
              <div className="text-xs space-y-1">
                <div>Form No :</div>
                <div>Issued :</div>
                <div>Rev. No :</div>
              </div>
            </td>
          </tr>

          {/* Quantity Shortage Notes Header */}
          <tr>
            <td colSpan={3} className="border border-black p-2 text-center">
              <div className="font-bold text-base">QUANTITY SHORTAGE NOTES</div>
              <div className="text-sm italic">(BERITA ACARA SUSUT KWANTITAS)</div>
            </td>
          </tr>

          {/* Main Content Row */}
          <tr>
            <td colSpan={3} className="border border-black p-4">
              {/* Content Text */}
              <div className="text-sm mb-4">
                <p className="text-justify leading-relaxed">
                  Dengan ini, saya supir pengangkutan dan petugas keamanan beserta Operator
                  Timbangan dari PT Evyap Sabun Indonesia telah menyaksikan susut quantity
                  berdasarkan timbangan yang tercatat dari:
                </p>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-8 text-sm mb-6">
                {/* Left Column */}
                <div className="space-y-2">
                  <div className="grid grid-cols-[120px_auto] gap-2">
                    <span>Tanggal</span>
                    <span>: {new Date().toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="grid grid-cols-[120px_auto] gap-2">
                    <span>Supplier</span>
                    <span>: {document?.supplier || ''}</span>
                  </div>
                  <div className="grid grid-cols-[120px_auto] gap-2">
                    <span>Nomor Kontrak</span>
                    <span>: {document?.contractNumber || ''}</span>
                  </div>
                  <div className="grid grid-cols-[120px_auto] gap-2">
                    <span>Nomor Polisi</span>
                    <span>: {document?.vehicleNumber || ''}</span>
                  </div>
                  <div className="grid grid-cols-[120px_auto] gap-2">
                    <span>Transporter</span>
                    <span>: {document?.transporter || ''}</span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-2">
                  <div className="grid grid-cols-[120px_auto] gap-2">
                    <span>Selisih</span>
                    <span>: {weighOut?.shrinkage_value || 0} Kg</span>
                  </div>
                  <div className="grid grid-cols-[120px_auto] gap-2">
                    <span>Persentase</span>
                    <span>: {shrinkagePercent}%</span>
                  </div>
                  <div className="grid grid-cols-[120px_auto] gap-2">
                    <span>Toleransi Kwantiti</span>
                    <span>
                      : <strong>0.20 %</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Weight Information */}
              <div className="text-sm mb-6">
                <div className="grid grid-cols-[150px_auto_50px] gap-2 mb-2">
                  <span>Netto Supplier</span>
                  <span>: _________________ Kg</span>
                </div>
                <div className="grid grid-cols-[150px_auto_50px] gap-2 mb-4">
                  <span>Netto Evyap</span>
                  <span>: _________________ Kg</span>
                </div>
                <p className="text-justify">
                  Demikian berita acara susut <strong>(Netto)</strong> ini di buat dengan
                  sebenarnya.
                </p>
              </div>

              {/* Signature Section */}
              <div className="grid grid-cols-2 gap-8 mt-8">
                <div className="text-center">
                  <div className="mb-16">Dibuat Oleh,</div>
                  <div className="border-t border-black pt-1">Supir</div>
                </div>
                <div className="text-center">
                  <div className="mb-16">Mengetahui,</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-t border-black pt-1">Security</div>
                    <div className="border-t border-black pt-1">Weighbridge Operator</div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Footer Note */}
      <div className="mt-2 text-xs italic print:block">
        <strong>Note :</strong> Berita Acara untuk susut kendaraan jika diatas 0.20% , akan otomatis
        Berita Acara bisa dicetak
      </div>

      {/* Print Button - Hidden in print mode */}
      <div className="mt-6 text-center print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
        >
          Print Document
        </button>
      </div>
    </div>
  );
}
