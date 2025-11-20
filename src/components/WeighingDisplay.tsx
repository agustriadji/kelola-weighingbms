'use client'

import { useState, useEffect } from 'react'

export default function WeighingDisplay() {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour12: false }))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-blue-100 text-center rounded-lg shadow-md p-4">
      
      {/* Tab Menu */}
      <div className="flex mb-6">
        <button className="px-4 py-2 border border-gray-400 bg-gray-200">List Truck Parkir</button>
        <button className="px-4 py-2 border border-gray-400 bg-white">Truck Unloading</button>
        <button className="px-4 py-2 border border-gray-400 bg-white">Truck Reject</button>
        <button className="px-4 py-2 border border-gray-400 bg-white">Closed WB</button>
      </div>

      {/* Header Wrapper */}
      <div className="bg-blue-100 p-4 mb-6 border border-gray-400">
        <div className="flex gap-4 items-start">
          {/* Vehicle Number */}
          <div className="flex-shrink-0 w-48">
            <div className="bg-white p-6 text-center border-2 border-black h-32 flex flex-col justify-center">
              <div className="text-2xl lg:text-3xl font-bold leading-tight">
                BK<br/>1234<br/>ABC
              </div>
            </div>
            <button className="w-full bg-gray-300 py-2 border border-gray-400 mt-2 text-sm">Refresh</button>
          </div>

          {/* Weight Display */}
          <div className="flex-1 min-w-0">
            <div className="bg-white p-6 text-center border-2 border-black h-32 flex flex-col justify-center">
              <div className="text-green-600 text-lg font-bold mb-1">BRUTTO</div>
              <div className="text-4xl lg:text-5xl font-bold">35490</div>
              <div className="text-lg">Kg</div>
            </div>
            <div className="text-center mt-2 bg-blue-100 py-2">
              <div className="text-xs mb-1">Proses</div>
              <div className="text-sm lg:text-base font-bold">
                IN <span className="mx-1">WEIGHING</span>
                <span className="mx-1">1</span> 
                <span className="text-blue-500">TARRA</span> 
                <span className="mx-1">0</span>
                <span className="text-red-500">NETTO</span> 
                <span className="mx-1">35490</span> Kg
              </div>
            </div>
          </div>

          {/* Right Info */}
          <div className="flex-shrink-0 w-48 space-y-2">
            {/* Outstanding Contract */}
            <div className="bg-white p-3 text-center border border-gray-400">
              <div className="text-xs font-semibold mb-2">Outstanding<br/>Contract</div>
              <div className="text-lg font-bold border border-gray-400 bg-white p-2">1.480.000</div>
            </div>

            {/* Susut/Gain */}
            <div className="bg-white p-2 text-center border border-gray-400">
              <div className="text-xs mb-2">Susut/Gain Brutto</div>
              <div className="grid grid-cols-2 gap-1">
                <div className="bg-white px-2 py-1 border border-gray-400 text-xs">-10<br/>Kg</div>
                <div className="bg-white px-2 py-1 border border-gray-400 text-xs">-0,02<br/>%</div>
              </div>
            </div>

            {/* Time */}
            <div className="bg-white p-3 text-center border border-gray-400">
              <div className="text-xs mb-1">Time</div>
              <div className="text-lg font-bold">{currentTime}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Section */}
        <div className="lg:col-span-5 space-y-4">
          {/* Form Fields */}
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-32 text-sm">Register ID*</label>
              <input type="text" value="123456" className="flex-1 border border-gray-400 px-2 py-1" />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-sm">Tiket Number*</label>
              <input type="text" value="00001" className="flex-1 border border-gray-400 px-2 py-1" />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-sm">Driver Name*</label>
              <input type="text" value="MULYONO" className="flex-1 border border-gray-400 px-2 py-1" />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-sm">Vehicle Type*</label>
              <input type="text" value="TANKI" className="flex-1 border border-gray-400 px-2 py-1" />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-sm">Container*</label>
              <input type="text" value="-" className="flex-1 border border-gray-400 px-2 py-1" />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-sm">Transporter*</label>
              <input type="text" value="PT. SAMUDERA" className="flex-1 border border-gray-400 px-2 py-1" />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-sm">Vessel Name*</label>
              <input type="text" value="-" className="flex-1 border border-gray-400 px-2 py-1" />
            </div>
          </div>

          <button className="w-full bg-gray-400 py-3 text-lg font-semibold border border-gray-500">
            SAVE / TAPP IN
          </button>

          <div>
            <div className="text-center mb-2">Nama Operator</div>
            <input type="text" value="SYAWAL SEPTIAN" className="w-full border border-gray-400 px-2 py-2 text-center" />
          </div>
        </div>

        {/* Center Section */}
        <div className="lg:col-span-4 space-y-4">
          {/* Contract/SO Fields */}
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-24 text-sm">Contract/SO*</label>
              <input type="text" value="001/CPO/PT.ABC/BULAN/TAHUN" className="flex-1 border border-gray-400 px-2 py-1" />
            </div>
            <div className="flex items-center">
              <label className="w-24 text-sm">DO*</label>
              <input type="text" value="12345678910" className="flex-1 border border-gray-400 px-2 py-1" />
            </div>
            <div className="flex items-center">
              <label className="w-24 text-sm">PO*</label>
              <input type="text" value="12345678910" className="flex-1 border border-gray-400 px-2 py-1" />
            </div>
            <div className="flex items-center">
              <label className="w-24 text-sm">Product*</label>
              <input type="text" value="CRUDE PALM OIL" className="flex-1 border border-gray-400 px-2 py-1" />
            </div>
            <div className="flex items-center">
              <label className="w-24 text-sm">Destination*</label>
              <input type="text" value="" className="flex-1 border border-gray-400 px-2 py-1" />
            </div>
            <div className="flex items-center">
              <label className="w-24 text-sm">Supplier*</label>
              <input type="text" value="PT. JAYA Chemical" className="flex-1 border border-gray-400 px-2 py-1" />
            </div>
            <div className="flex items-center">
              <label className="w-24 text-sm">Mill Original*</label>
              <input type="text" value="PT. SEI" className="flex-1 border border-gray-400 px-2 py-1" />
            </div>
          </div>

          {/* Weight Fields */}
          <div className="space-y-2">
            <div className="flex items-center">
              <label className="w-24 text-sm">Bruto Supplier</label>
              <input type="text" value="4500" className="flex-1 border border-gray-400 px-2 py-1" />
              <span className="ml-2">Kg</span>
            </div>
            <div className="flex items-center">
              <label className="w-24 text-sm">Tarra Supplier</label>
              <input type="text" value="4600" className="flex-1 border border-gray-400 px-2 py-1" />
              <span className="ml-2">Kg</span>
            </div>
            <div className="flex items-center">
              <label className="w-24 text-sm">Netto Supplier</label>
              <input type="text" value="4900" className="flex-1 border border-gray-400 px-2 py-1" />
              <span className="ml-2">Kg</span>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Remarks</label>
            <textarea className="w-full border border-gray-400 px-2 py-1 h-16" defaultValue="REMARKS"></textarea>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-3 space-y-4">
          {/* Seal & SIM */}
          <div className="space-y-2">
            <div className="flex">
              <label className="w-16 text-xs">NO. SEAL</label>
              <input type="text" value="AB0001 - AB0005" className="flex-1 border border-gray-400 px-1 py-1 text-xs" />
            </div>
            <div className="flex">
              <label className="w-16 text-xs">NO. SIM</label>
              <input type="text" value="12345678" className="flex-1 border border-gray-400 px-1 py-1 text-xs" />
            </div>
          </div>

          {/* Vehicle History */}
          <div>
            <div className="text-sm font-semibold mb-2">Vehicle History</div>
            <table className="w-full text-xs border border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-1 py-1">NO. POLISI</th>
                  <th className="border border-gray-400 px-1 py-1">BRUTO</th>
                  <th className="border border-gray-400 px-1 py-1">TARRA</th>
                  <th className="border border-gray-400 px-1 py-1">NETTO</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-400 px-1 py-1">AA 9999 ABC</td><td className="border border-gray-400 px-1 py-1">35440</td><td className="border border-gray-400 px-1 py-1">15600</td><td className="border border-gray-400 px-1 py-1">19840</td></tr>
                <tr><td className="border border-gray-400 px-1 py-1">AA 9999 ABC</td><td className="border border-gray-400 px-1 py-1">35490</td><td className="border border-gray-400 px-1 py-1">15610</td><td className="border border-gray-400 px-1 py-1">19880</td></tr>
                <tr><td className="border border-gray-400 px-1 py-1">AA 9999 ABC</td><td className="border border-gray-400 px-1 py-1">35410</td><td className="border border-gray-400 px-1 py-1">15600</td><td className="border border-gray-400 px-1 py-1">19810</td></tr>
                <tr><td className="border border-gray-400 px-1 py-1">AA 9999 ABC</td><td className="border border-gray-400 px-1 py-1">35420</td><td className="border border-gray-400 px-1 py-1">15800</td><td className="border border-gray-400 px-1 py-1">19620</td></tr>
                <tr><td className="border border-gray-400 px-1 py-1">AA 9998 ABC</td><td className="border border-gray-400 px-1 py-1">35000</td><td className="border border-gray-400 px-1 py-1">15630</td><td className="border border-gray-400 px-1 py-1">19370</td></tr>
              </tbody>
            </table>
          </div>

          {/* Tarra History */}
          <div>
            <div className="text-sm font-semibold mb-2">Tarra History</div>
            <table className="w-full text-xs border border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-1 py-1">NO. POLISI</th>
                  <th className="border border-gray-400 px-1 py-1">Tarra Awal</th>
                  <th className="border border-gray-400 px-1 py-1">Tarra Terendah</th>
                  <th className="border border-gray-400 px-1 py-1">Tarra Tertinggi</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-400 px-1 py-1">AA 9999 ABC</td><td className="border border-gray-400 px-1 py-1">15650</td><td className="border border-gray-400 px-1 py-1">15600</td><td className="border border-gray-400 px-1 py-1">15800</td></tr>
              </tbody>
            </table>
          </div>

          {/* Bottom Fields */}
          <div className="space-y-2">
            <div className="flex">
              <label className="w-20 text-xs">Netto Evyap*</label>
              <input type="text" value="35490" className="flex-1 border border-gray-400 px-1 py-1 text-xs" />
              <span className="text-xs ml-1">Kg</span>
            </div>
            <div className="flex">
              <label className="w-20 text-xs">Susut/Gain Netto*</label>
              <input type="text" value="0" className="flex-1 border border-gray-400 px-1 py-1 text-xs" />
              <span className="text-xs ml-1">Kg</span>
            </div>
            <div className="flex">
              <label className="w-20 text-xs">Presentase Netto*</label>
              <input type="text" value="0" className="flex-1 border border-gray-400 px-1 py-1 text-xs" />
              <span className="text-xs ml-1">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}