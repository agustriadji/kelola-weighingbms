'use client';

import { useWeighing } from '@/hooks/useWeighing';

interface InDocumentPrintRawNMiscTemplateProps {
  onPrint?: () => void;
}

export default function InDocumentPrintRawNMiscTemplate({
  onPrint,
}: InDocumentPrintRawNMiscTemplateProps) {
  const { currentBatch, currentTime } = useWeighing();

  if (!currentBatch) return null;

  const { inbound, document } = currentBatch;
  const weighIn = inbound?.weighIn;

  const handlePrint = () => {
    window.print();
    onPrint?.();
  };

  return (
    <div className="bg-white print:p-0 print-content print:max-w-none print:w-full print:h-full">
      {/* Header - Hidden in print */}
      <div className="text-center mb-4 print:hidden">
        <h1 className="text-sm font-bold mb-2">
          TAMPILAN FORM SERAH TERIMA TRUCK DARI WB UNTUK QC-TF-SECURITY (RAW MATERIAL &
          MISCELLANEOUS)
        </h1>
      </div>

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
                  className="w-32 h-24 object-contain"
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

          {/* Vehicle Handover Form Header */}
          <tr>
            <td className="py-1 border-opacity-0 border border-white"></td>
          </tr>
          <tr className="top-4">
            <td colSpan={3} className="border border-white p-2 text-center font-bold bg-gray-100">
              VEHICLE HANDOVER FORM
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
                      <span>: {document?.material || '-'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">TRANSPORTER</span>
                      <span>: {document?.transporter || '-'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">DRIVER NAME</span>
                      <span>: {document?.driverName || '-'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">DO. NO</span>
                      <span>: {document?.doNumber || '-'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">SEAL NO</span>
                      <span>: {document?.sealNumber || '-'}</span>
                    </div>
                  </div>

                  {/* Weighbridge Evyap */}
                  <div className="mb-4">
                    <div className="font-bold mb-2">Weighbridge Evyap</div>
                    <table className="border border-black text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-black p-2">Time In</th>
                          <th className="border border-black p-2">Weighing In</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-black p-2 text-center">
                            {weighIn?.weighingAt
                              ? new Date(weighIn.weighingAt).toLocaleTimeString('id-ID', {
                                  hour12: false,
                                })
                              : '07:02:55'}
                          </td>
                          <td className="border border-black p-2 text-center">
                            {weighIn?.weight || '35490'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Quality Supplier */}
                  <div className="mb-4">
                    <div className="font-bold mb-2">Quality Supplier</div>
                    <table className="border border-black text-sm w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-black p-2">FFA</th>
                          <th className="border border-black p-2">MOIST</th>
                          <th className="border border-black p-2">IMPURITIES</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-black p-2 text-center">
                            {document?.ffa || '0'}
                          </td>
                          <td className="border border-black p-2 text-center">
                            {document?.moist || '0'}
                          </td>
                          <td className="border border-black p-2 text-center">
                            {document?.impurity || '0'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Weighbridge Supplier */}
                  <div>
                    <div className="font-bold mb-2">Weighbridge Supplier</div>
                    <table className="border border-black text-sm w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-black p-2">Bruto</th>
                          <th className="border border-black p-2">Tarra</th>
                          <th className="border border-black p-2">Netto</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-black p-2 text-center">
                            {weighIn?.weight || '0'}
                          </td>
                          <td className="border border-black p-2 text-center">0</td>
                          <td className="border border-black p-2 text-center">0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <div className="text-left mb-4 space-y-2 text-sm px-6">
                    {/* position right */}
                    <div className="justify-end px-6 grid grid-rows-2 gap-2">
                      <div className="col-span-2 grid grid-cols-[110px_auto] gap-2">
                        <span className="font-semibold">RFID NO</span>
                        <span>: {inbound?.rfid || '123456'}</span>
                      </div>

                      <div className="col-span-1 grid grid-cols-[110px_auto] gap-2">
                        <span className="font-semibold">TICKET NO</span>
                        <span>: {document?.id || '00001'}</span>
                      </div>
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
                      <span>: {document?.supplier || '-'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">MILL ORIGIN</span>
                      <span>: {document?.millOriginal || '-'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">SERTIFIKAT</span>
                      <span>: {document?.certificate || '-'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">TYPE BC</span>
                      <span>: {document?.typeBC || '0'}</span>
                    </div>
                    <div className="grid grid-cols-[110px_auto] gap-2">
                      <span className="font-semibold">NO. BC</span>
                      <span>: {document?.bcNumber || '0'}</span>
                    </div>
                  </div>

                  {/* Department Table */}
                  <div className="mb-6 px-6">
                    <table className="border border-black text-sm w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-black p-2">Dept</th>
                          <th className="border border-black p-2">WB</th>
                          <th className="border border-black p-2">QC</th>
                          <th className="border border-black p-2">TF</th>
                          <th className="border border-black p-2">SEC</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-black p-2 text-center font-semibold">
                            Time Out
                          </td>
                          <td className="border border-black p-2"></td>
                          <td className="border border-black p-2"></td>
                          <td className="border border-black p-2"></td>
                          <td className="border border-black p-2"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Signature Section */}
                  <div className="grid grid-cols-4 gap-4 text-xs text-center pt-2">
                    <div>
                      <div className="mb-20">Prepared by,</div>
                      <div className="border-t border-black pt-1">Weighbridge Opt</div>
                    </div>
                    <div>
                      <div className="mb-20">Received by,</div>
                      <div className="border-t border-black pt-1">Quality Control</div>
                    </div>
                    <div>
                      <div className="mb-20">Received by,</div>
                      <div className="border-t border-black pt-1">Tank Farm</div>
                    </div>
                    <div>
                      <div className="mb-20">Checked by,</div>
                      <div className="border-t border-black pt-1">Security</div>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Footer Note */}
      {/* <div className="mt-4 text-xs">
        <strong>Note :</strong>{' '}
        <em>
          Vehicle Handover Form tersebut otomatis tercetak saat Tapp In 1 (Pertama )/Save untuk di
          serahkan kepada driver sebagai surat untuk bongkar Material
        </em>
      </div> */}

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
