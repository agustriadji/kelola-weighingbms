'use client';

import { useWeighing } from '@/hooks/useWeighing';

interface OutDocumentPrintRawNMiscTemplateProps {
  onPrint?: () => void;
}

export default function OutDocumentPrintRawNMiscTemplate({
  onPrint,
}: OutDocumentPrintRawNMiscTemplateProps) {
  const { currentBatch, currentTime } = useWeighing();

  if (!currentBatch) return null;

  const { inbound, document } = currentBatch;
  const weighIn = inbound?.weighIn;
  const weighOut = inbound?.weighOut;

  const handlePrint = () => {
    window.print();
    onPrint?.();
  };

  // Calculate netto
  const bruto = weighIn.brutto || 0;
  const tarra = weighIn.tarra || 0;
  const netto =
    Number(inbound.weighIn.netto) < 0 ? Math.abs(inbound.weighIn.netto) : inbound.weighIn.netto;
  const varianceEvyap = bruto - 35500;
  const varianceSupplier = tarra - 15600;
  const totalEvyap = bruto + tarra;
  const totalSupplier = 35500 + 15600;
  const OriginalNetto = totalEvyap - totalSupplier;

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

          {/* Weighbridge Ticket Header */}
          <tr>
            <td colSpan={3} className="border border-black p-2 text-center font-bold bg-gray-100">
              WEIGHBRIDGE TICKET
            </td>
          </tr>

          {/* Main Content Row */}
          <tr>
            <td colSpan={3} className="border border-black p-4">
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                  <div className="text-xl font-bold mb-4">
                    VEHICLE NO : {document?.vehicleNumber || 'BK 1234 ABC'}
                  </div>

                  <div className="space-y-2 text-sm mb-6">
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">PRODUCT</span>
                      <span>: {document?.material || 'CRUDE PALM OIL'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">TRANSPORTER</span>
                      <span>: {document?.transporter || 'PT. SAMUDERA'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">DRIVER NAME</span>
                      <span>: {document?.driverName || 'MULYONO'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">DO. NO</span>
                      <span>: {document?.doNumber || '1234567810'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">SEAL NO</span>
                      <span>: {document?.sealNumber || 'AB0001 - AB0005'}</span>
                    </div>
                  </div>

                  {/* Prepared by section */}
                  <div className="mt-8 text-sm">
                    <div className="mb-2">
                      <span className="font-semibold">Prepared WB in by :</span> Syawal Septian
                    </div>
                    <div>
                      <span className="font-semibold">Prepared WB out by :</span> Febby Prayoga
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <div className="text-left mb-4 space-y-2 text-sm">
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">RFID NO</span>
                      <span>: {inbound?.rfid || '123456'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">TICKET NO</span>
                      <span>: {document?.id || '00001'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">DATE OF TICKET</span>
                      <span>: {new Date().toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">CONTRACT NO</span>
                      <span>: {document?.contractNumber || '001/CPO/PT.ABC/BULAN/TAHUN'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">PO. NO</span>
                      <span>: {document?.poNumber || '12345678910'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">SUPPLIER</span>
                      <span>: {document?.supplier || 'PT. AGRO JAYA PERDANA'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">MILL ORIGIN</span>
                      <span>: {document?.millOriginal || 'PT. SEI MANGKEI'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">SERTIFIKAT</span>
                      <span>: {document?.certificate || 'RSPO/ISCC'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">TYPE BC</span>
                      <span>: {document?.typeBC || '4.0'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">NO. BC</span>
                      <span>: {document?.bcNumber || '123456'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weighing Table */}
              <div className="mt-6">
                <table className="border border-black text-sm w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-black p-2"></th>
                      <th className="border border-black p-2">DATE</th>
                      <th className="border border-black p-2">TIME</th>
                      <th className="border border-black p-2">WEIGH (KG)</th>
                      <th className="border border-black p-2">PT. EVYAP</th>
                      <th className="border border-black p-2">SUPPLIER</th>
                      <th className="border border-black p-2">VARIANCE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black p-2 text-center font-semibold">IN</td>
                      <td className="border border-black p-2 text-center">
                        {weighIn?.weighingAt
                          ? new Date(weighIn.weighingAt).toLocaleDateString('id-ID')
                          : '1 NOVEMBER 2025'}
                      </td>
                      <td className="border border-black p-2 text-center">
                        {weighIn?.weighingAt
                          ? new Date(weighIn.weighingAt).toLocaleTimeString('id-ID', {
                              hour12: false,
                            })
                          : '07:02:55'}
                      </td>
                      <td className="border border-black p-2 text-center">BRUTO</td>
                      <td className="border border-black p-2 text-center">{bruto || '35490'}</td>
                      <td className="border border-black p-2 text-center">35500</td>
                      <td className="border border-black p-2 text-center">{varianceEvyap}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 text-center font-semibold">OUT</td>
                      <td className="border border-black p-2 text-center">
                        {weighOut?.weighingAt
                          ? new Date(weighOut.weighingAt).toLocaleDateString('id-ID')
                          : '1 NOVEMBER 2025'}
                      </td>
                      <td className="border border-black p-2 text-center">
                        {weighOut?.weighingAt
                          ? new Date(weighOut.weighingAt).toLocaleTimeString('id-ID', {
                              hour12: false,
                            })
                          : '07:50:20'}
                      </td>
                      <td className="border border-black p-2 text-center">TARRA</td>
                      <td className="border border-black p-2 text-center">{tarra || '15610'}</td>
                      <td className="border border-black p-2 text-center">15600</td>
                      <td className="border border-black p-2 text-center">{varianceSupplier}</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-black p-2 text-center font-semibold" colSpan={4}>
                        NETTO
                      </td>
                      <td className="border border-black p-2 text-center font-semibold">
                        {totalEvyap}
                      </td>
                      <td className="border border-black p-2 text-center font-semibold">
                        {totalSupplier}
                      </td>
                      <td className="border border-black p-2 text-center font-semibold">
                        {OriginalNetto}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signature Section */}
              <div className="grid grid-cols-3 gap-8 text-xs text-center mt-6">
                <div>
                  <div className="mb-16">Prepared by,</div>
                  <div className="border-t border-black pt-1">Wb Operator</div>
                </div>
                <div>
                  <div className="mb-16">Acknowledged by,</div>
                  <div className="border-t border-black pt-1">Security</div>
                </div>
                <div>
                  <div className="mb-16">Transported by,</div>
                  <div className="border-t border-black pt-1">Driver</div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

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
