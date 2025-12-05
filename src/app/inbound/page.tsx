import { Search, Eye } from 'lucide-react';

export default async function InboundListPage() {
  // TODO: Replace with real DB/API call
  const data = [
    {
      id: 'TRX-20250201-001',
      plate: 'BK 1234 AB',
      supplier: 'PT Sawit Makmur',
      transporter: 'PT Angkut Jaya',
      docType: 'DO',
      docNumber: 'DO-99281',
      status: 'pending',
      timestamp: '2025-02-01 10:20',
      snapshot: true,
    },
    {
      id: 'TRX-20250201-002',
      plate: 'BK 8890 ZZ',
      supplier: 'PT Agro Sejahtera',
      transporter: 'CV Lancar',
      docType: 'SJ',
      docNumber: 'SJ-5518',
      status: 'approved',
      timestamp: '2025-02-01 09:50',
      snapshot: false,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Inbound List</h1>

        <a
          href="/inbound/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          + Create Inbound
        </a>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-2 w-full max-w-md">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search plate / supplier / DO..."
          className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="px-4 py-2">Plate</th>
              <th className="px-4 py-2">Supplier</th>
              <th className="px-4 py-2">Transporter</th>
              <th className="px-4 py-2">Document</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Snapshot</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2 font-medium">{item.plate}</td>
                <td className="px-4 py-2">{item.supplier}</td>
                <td className="px-4 py-2">{item.transporter}</td>

                <td className="px-4 py-2">
                  {item.docType} - {item.docNumber}
                </td>

                <td className="px-4 py-2">
                  <span
                    className={
                      'px-2 py-1 rounded text-xs font-medium ' +
                      (item.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : item.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700')
                    }
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-4 py-2">{item.snapshot ? '✔️' : '❌'}</td>

                <td className="px-4 py-2">{item.timestamp}</td>

                <td className="px-4 py-2 text-right">
                  <a
                    href={`/inbound/${item.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1 border rounded-md hover:bg-gray-100"
                  >
                    <Eye className="w-4 h-4" /> View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
