'use client'

import { useState, useEffect } from 'react'
import PermissionGate from '@/components/PermissionGate'
import { Permissions } from '@/types/rbac'
import { useAuth } from '@/hooks/useAuth'
import { apiGet, apiPost } from '@/utils/api'

export default function WeighingDisplay() {
  const [currentTime, setCurrentTime] = useState('')
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [materials, setMaterials] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [batches, setBatches] = useState<any[]>([])
  const [currentBatch, setCurrentBatch] = useState<any>(null)
  const [currentWeight, setCurrentWeight] = useState(0)
  const [isStable, setIsStable] = useState(false)
  const [weightHistory, setWeightHistory] = useState<any[]>([])
  const [vehicleHistory, setVehicleHistory] = useState<any[]>([])
  const [tarraHistory, setTarraHistory] = useState<any>(null)
  const [brutoWeight, setBrutoWeight] = useState(0)
  const [tarraWeight, setTarraWeight] = useState(0)
  const [nettoWeight, setNettoWeight] = useState(0)
  const [expectedNetto, setExpectedNetto] = useState(0)
  const [shrinkageData, setShrinkageData] = useState<any>(null)
  const [formData, setFormData] = useState({
    batchName: '',
    vehicleId: '',
    supplierId: '',
    materialId: '',
    driverName: '',
    ticketNumber: ''
  })
  const { user } = useAuth()

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour12: false }))
    }
    
    updateTime()
    const timeInterval = setInterval(updateTime, 1000)
    
    loadMasterData()
    loadBatches()
    
    // Simulate weight updates every 2 seconds
    const weightInterval = setInterval(() => {
      if (currentBatch?.status === 'ongoing') {
        simulateWeight()
      }
    }, 2000)
    
    return () => {
      clearInterval(timeInterval)
      clearInterval(weightInterval)
    }
  }, [])

  const loadMasterData = async () => {
    try {
      const [suppliersRes, materialsRes, vehiclesRes] = await Promise.all([
        apiGet('/api/suppliers'),
        apiGet('/api/materials'),
        apiGet('/api/vehicles')
      ])
      
      const [suppliersData, materialsData, vehiclesData] = await Promise.all([
        suppliersRes.json(),
        materialsRes.json(),
        vehiclesRes.json()
      ])
      
      setSuppliers(suppliersData.suppliers || [])
      setMaterials(materialsData.materials || [])
      setVehicles(vehiclesData.vehicles || [])
    } catch (error) {
      console.error('Error loading master data:', error)
    }
  }

  const loadBatches = async () => {
    try {
      const response = await apiGet('/api/batch/list')
      const data = await response.json()
      console.log('Loaded batches:', data)
      setBatches(data || [])
      
      // Find current batch (only pending or ongoing, not finished)
      const current = data?.find((b: any) => b.status === 'pending' || b.status === 'ongoing')
      console.log('Current batch:', current)
      setCurrentBatch(current || null)
      
      // Load vehicle history if batch exists
      if (current?.vehicle?.id) {
        loadVehicleHistory(current.vehicle.id)
      }
    } catch (error) {
      console.error('Error loading batches:', error)
    }
  }

  const loadVehicleHistory = async (vehicleId: number) => {
    try {
      const [historyRes, tarraRes] = await Promise.all([
        apiGet(`/api/vehicles/history?vehicleId=${vehicleId}`),
        apiGet(`/api/vehicles/tarra?vehicleId=${vehicleId}`)
      ])
      
      const [historyData, tarraData] = await Promise.all([
        historyRes.json(),
        tarraRes.json()
      ])
      
      setVehicleHistory(historyData || [])
      setTarraHistory(tarraData)
    } catch (error) {
      console.error('Error loading vehicle history:', error)
    }
  }

  const createBatch = async () => {
    try {
      const response = await apiPost('/api/batch/create', formData)
      
      if (response.ok) {
        alert('Batch created successfully')
        loadBatches()
        resetWeights()
        setFormData({ batchName: '', vehicleId: '', supplierId: '', materialId: '', driverName: '', ticketNumber: '' })
      }
    } catch (error) {
      console.error('Error creating batch:', error)
    }
  }

  const resetWeights = () => {
    setBrutoWeight(0)
    setTarraWeight(0)
    setNettoWeight(0)
    setExpectedNetto(0)
    setCurrentWeight(0)
    setWeightHistory([])
    setShrinkageData(null)
  }

  const startBatch = async (id: number) => {
    try {
      const response = await apiPost('/api/batch/start', { id })
      
      if (response.ok) {
        loadBatches()
      }
    } catch (error) {
      console.error('Error starting batch:', error)
    }
  }

  const endBatch = async (id: number) => {
    try {
      const response = await apiPost('/api/batch/end', { 
        id, 
        expectedNetto: expectedNetto || nettoWeight,
        actualNetto: nettoWeight 
      })
      
      if (response.ok) {
        const result = await response.json()
        setShrinkageData(result.shrinkage)
        
        if (result.shrinkage?.warning) {
          alert(`WARNING: Shrinkage ${result.shrinkage.shrinkagePercent.toFixed(2)}% exceeds 0.2% threshold!`)
        }
        
        loadBatches()
        resetWeights()
      }
    } catch (error) {
      console.error('Error ending batch:', error)
    }
  }

  const simulateWeight = () => {
    // Simulate realistic weight fluctuation
    const baseWeight = 35000 + Math.random() * 1000
    const fluctuation = (Math.random() - 0.5) * 100
    const newWeight = Math.round(baseWeight + fluctuation)
    const stable = Math.random() > 0.3 // 70% chance of stable reading
    
    setCurrentWeight(newWeight)
    setIsStable(stable)
    
    // Auto-capture weights when stable
    if (stable && currentBatch?.status === 'ongoing') {
      if (brutoWeight === 0) {
        setBrutoWeight(newWeight)
      } else if (tarraWeight === 0 && newWeight < brutoWeight * 0.7) {
        setTarraWeight(newWeight)
        setNettoWeight(brutoWeight - newWeight)
      }
    }
    
    // Save weight record if batch is ongoing
    if (currentBatch?.status === 'ongoing') {
      saveWeightRecord(newWeight)
    }
  }

  const saveWeightRecord = async (weight: number) => {
    try {
      await apiPost('/api/weight/save', {
        batchId: currentBatch.id,
        weight,
        stable: isStable,
        source: 'simulation'
      })
      
      // Update weight history
      setWeightHistory(prev => [
        { weight, timestamp: new Date(), stable: isStable },
        ...prev.slice(0, 9)
      ])
    } catch (error) {
      console.error('Error saving weight:', error)
    }
  }

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
              <div className={`text-4xl lg:text-5xl font-bold ${isStable ? 'text-green-600' : 'text-yellow-600'}`}>
                {currentWeight || '0'}
              </div>
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
                <span className="mx-1">{currentWeight || '0'}</span> Kg
                <span className={`ml-2 px-2 py-1 rounded text-xs ${isStable ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {isStable ? 'STABLE' : 'UNSTABLE'}
                </span>
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
          {/* Batch Form */}
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-32 text-sm">Batch Name*</label>
              <input 
                type="text" 
                value={formData.batchName}
                onChange={(e) => setFormData({...formData, batchName: e.target.value})}
                className="flex-1 border border-gray-400 px-2 py-1" 
              />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-sm">Vehicle*</label>
              <select 
                value={formData.vehicleId}
                onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                className="flex-1 border border-gray-400 px-2 py-1"
              >
                <option value="">Select Vehicle</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.plate} - {v.type}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="w-32 text-sm">Supplier*</label>
              <select 
                value={formData.supplierId}
                onChange={(e) => setFormData({...formData, supplierId: e.target.value})}
                className="flex-1 border border-gray-400 px-2 py-1"
              >
                <option value="">Select Supplier</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="w-32 text-sm">Material*</label>
              <select 
                value={formData.materialId}
                onChange={(e) => setFormData({...formData, materialId: e.target.value})}
                className="flex-1 border border-gray-400 px-2 py-1"
              >
                <option value="">Select Material</option>
                {materials.map(m => (
                  <option key={m.id} value={m.id}>{m.description}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="w-32 text-sm">Driver Name*</label>
              <input 
                type="text" 
                value={formData.driverName}
                onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                className="flex-1 border border-gray-400 px-2 py-1" 
              />
            </div>
            <div className="flex items-center">
              <label className="w-32 text-sm">Ticket Number*</label>
              <input 
                type="text" 
                value={formData.ticketNumber}
                onChange={(e) => setFormData({...formData, ticketNumber: e.target.value})}
                className="flex-1 border border-gray-400 px-2 py-1" 
              />
            </div>
          </div>

          {/* Batch Status Display */}
          {currentBatch && (
            <div className={`p-4 rounded border-2 mb-4 ${
              currentBatch.status === 'pending' ? 'bg-yellow-100 border-yellow-400' :
              currentBatch.status === 'ongoing' ? 'bg-green-100 border-green-400' :
              'bg-gray-100 border-gray-400'
            }`}>
              <div className="text-center">
                <div className="text-lg font-bold">CURRENT BATCH: {currentBatch.batchName}</div>
                <div className={`text-xl font-bold mt-2 ${
                  currentBatch.status === 'pending' ? 'text-yellow-600' :
                  currentBatch.status === 'ongoing' ? 'text-green-600' :
                  'text-gray-600'
                }`}>
                  STATUS: {currentBatch.status.toUpperCase()}
                </div>
                <div className="text-sm mt-1">
                  Vehicle: {currentBatch.vehicle?.plate} | Supplier: {currentBatch.supplier?.name}
                </div>
                {currentBatch.warningFlag && (
                  <div className="text-red-600 font-bold mt-2">
                    ⚠️ SHRINKAGE WARNING: {currentBatch.shrinkagePercent?.toFixed(2)}%
                  </div>
                )}
              </div>
            </div>
          )}

          <PermissionGate permission={Permissions.CREATE_WEIGHING}>
            {!currentBatch ? (
              <button 
                onClick={createBatch}
                className="w-full bg-blue-600 py-3 text-lg font-semibold border border-gray-500 text-white"
              >
                CREATE BATCH
              </button>
            ) : currentBatch.status === 'pending' ? (
              <button 
                onClick={() => startBatch(currentBatch.id)}
                className="w-full bg-green-600 py-3 text-lg font-semibold border border-gray-500 text-white"
              >
                START WEIGHING
              </button>
            ) : currentBatch.status === 'ongoing' ? (
              <button 
                onClick={() => endBatch(currentBatch.id)}
                className="w-full bg-red-600 py-3 text-lg font-semibold border border-gray-500 text-white"
              >
                END BATCH
              </button>
            ) : (
              <button 
                onClick={createBatch}
                className="w-full bg-blue-600 py-3 text-lg font-semibold border border-gray-500 text-white"
              >
                CREATE NEW BATCH
              </button>
            )}
          </PermissionGate>

          <div>
            <div className="text-center mb-2">Nama Operator</div>
            <input type="text" value={user?.fullName || ''} className="w-full border border-gray-400 px-2 py-2 text-center" readOnly />
          </div>
          
          {/* Weight Capture Status */}
          {currentBatch?.status === 'ongoing' && (
            <div className="bg-blue-100 border-2 border-blue-400 p-3 rounded">
              <div className="text-center">
                <div className="text-sm font-bold text-blue-800">WEIGHT CAPTURE STATUS</div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                  <div className={`p-2 rounded ${
                    brutoWeight > 0 ? 'bg-green-200 text-green-800' : 'bg-gray-200'
                  }`}>
                    BRUTO: {brutoWeight || 'Waiting...'}
                  </div>
                  <div className={`p-2 rounded ${
                    tarraWeight > 0 ? 'bg-green-200 text-green-800' : 'bg-gray-200'
                  }`}>
                    TARRA: {tarraWeight || 'Waiting...'}
                  </div>
                  <div className={`p-2 rounded ${
                    nettoWeight > 0 ? 'bg-green-200 text-green-800' : 'bg-gray-200'
                  }`}>
                    NETTO: {nettoWeight || 'Waiting...'}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Shrinkage Display */}
          {shrinkageData && (
            <div className={`p-4 rounded border-2 ${
              shrinkageData.warning ? 'bg-red-100 border-red-400' : 'bg-green-100 border-green-400'
            }`}>
              <div className="text-center">
                <div className="text-lg font-bold">SHRINKAGE ANALYSIS</div>
                <div className="text-sm mt-2">Value: {shrinkageData.shrinkageValue.toFixed(2)} Kg</div>
                <div className="text-sm">Percentage: {shrinkageData.shrinkagePercent.toFixed(2)}%</div>
                <div className={`text-lg font-bold mt-2 ${
                  shrinkageData.warning ? 'text-red-600' : 'text-green-600'
                }`}>
                  {shrinkageData.warning ? '⚠️ EXCEEDS THRESHOLD (>0.2%)' : '✅ WITHIN TOLERANCE'}
                </div>
              </div>
            </div>
          )}
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
              <input type="text" value={currentBatch?.material?.description || ''} className="flex-1 border border-gray-400 px-2 py-1" readOnly />
            </div>
            <div className="flex items-center">
              <label className="w-24 text-sm">Destination*</label>
              <input type="text" value="" className="flex-1 border border-gray-400 px-2 py-1" />
            </div>
            <div className="flex items-center">
              <label className="w-24 text-sm">Supplier*</label>
              <input type="text" value={currentBatch?.supplier?.name || ''} className="flex-1 border border-gray-400 px-2 py-1" readOnly />
            </div>
            <div className="flex items-center">
              <label className="w-24 text-sm">Mill Original*</label>
              <input type="text" value="PT. SEI" className="flex-1 border border-gray-400 px-2 py-1" />
            </div>
          </div>

          {/* Weight Fields */}
          <div className="space-y-2">
            <div className="flex items-center">
              <label className="w-24 text-sm">Bruto Evyap</label>
              <input type="text" value={brutoWeight || ''} className="flex-1 border border-gray-400 px-2 py-1" readOnly />
              <span className="ml-2">Kg</span>
            </div>
            <div className="flex items-center">
              <label className="w-24 text-sm">Tarra Evyap</label>
              <input type="text" value={tarraWeight || ''} className="flex-1 border border-gray-400 px-2 py-1" readOnly />
              <span className="ml-2">Kg</span>
            </div>
            <div className="flex items-center">
              <label className="w-24 text-sm">Expected Netto</label>
              <input 
                type="number" 
                value={expectedNetto || ''}
                onChange={(e) => setExpectedNetto(Number(e.target.value))}
                className="flex-1 border border-gray-400 px-2 py-1" 
              />
              <span className="ml-2">Kg</span>
            </div>
            <div className="flex items-center">
              <label className="w-24 text-sm">Actual Netto</label>
              <input type="text" value={nettoWeight || ''} className="flex-1 border border-gray-400 px-2 py-1" readOnly />
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
                {vehicleHistory.length > 0 ? (
                  vehicleHistory.map((record, index) => (
                    <tr key={index}>
                      <td className="border border-gray-400 px-1 py-1">{record.plate}</td>
                      <td className="border border-gray-400 px-1 py-1">{record.bruto}</td>
                      <td className="border border-gray-400 px-1 py-1">{record.tarra}</td>
                      <td className="border border-gray-400 px-1 py-1">{record.netto}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="border border-gray-400 px-1 py-1 text-center">No history data</td></tr>
                )}
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
                {tarraHistory ? (
                  <tr>
                    <td className="border border-gray-400 px-1 py-1">{tarraHistory.plate}</td>
                    <td className="border border-gray-400 px-1 py-1">{tarraHistory.initial}</td>
                    <td className="border border-gray-400 px-1 py-1">{tarraHistory.min}</td>
                    <td className="border border-gray-400 px-1 py-1">{tarraHistory.max}</td>
                  </tr>
                ) : (
                  <tr><td colSpan={4} className="border border-gray-400 px-1 py-1 text-center">No tarra data</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Fields */}
          <div className="space-y-2">
            <div className="flex">
              <label className="w-20 text-xs">Netto Final*</label>
              <input type="text" value={nettoWeight || '0'} className="flex-1 border border-gray-400 px-1 py-1 text-xs" readOnly />
              <span className="text-xs ml-1">Kg</span>
            </div>
            <div className="flex">
              <label className="w-20 text-xs">Susut/Gain*</label>
              <input 
                type="text" 
                value={expectedNetto && nettoWeight ? (expectedNetto - nettoWeight).toFixed(2) : '0'} 
                className="flex-1 border border-gray-400 px-1 py-1 text-xs" 
                readOnly 
              />
              <span className="text-xs ml-1">Kg</span>
            </div>
            <div className="flex">
              <label className="w-20 text-xs">Shrinkage %*</label>
              <input 
                type="text" 
                value={expectedNetto && nettoWeight ? (((expectedNetto - nettoWeight) / expectedNetto) * 100).toFixed(3) : '0'} 
                className={`flex-1 border px-1 py-1 text-xs ${
                  expectedNetto && nettoWeight && (((expectedNetto - nettoWeight) / expectedNetto) * 100) > 0.2 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-gray-400'
                }`}
                readOnly 
              />
              <span className="text-xs ml-1">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}