'use client'

import { useWeighing } from '@/hooks/useWeighing'
import { useAuth } from '@/hooks/useAuth'

export default function WeighingPage() {
  const { user } = useAuth()
  const {
    // State
    currentTime,
    suppliers,
    materials,
    vehicles,
    currentBatch,
    currentWeight,
    isStable,
    brutoWeight,
    tarraWeight,
    nettoWeight,
    formData,
    shrinkageData,
    
    // Actions
    createBatch,
    startBatch,
    endBatch,
    setFormData
  } = useWeighing()

  const handleCreateBatch = async () => {
    const success = await createBatch()
    if (!success) {
      alert('Failed to create batch')
    }
  }

  const handleStartBatch = async () => {
    if (!currentBatch) return
    const success = await startBatch(currentBatch.id)
    if (!success) {
      alert('Failed to start batch')
    }
  }

  const handleEndBatch = async () => {
    if (!currentBatch) return
    const success = await endBatch(currentBatch.id)
    if (!success) {
      alert('Failed to end batch')
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Weighing System</h1>
        <p className="text-gray-600">Current Time: {currentTime}</p>
        <p className="text-sm text-gray-500">User: {user?.username}</p>
      </div>

      {/* Current Weight Display */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Weight</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{currentWeight} kg</div>
            <div className="text-sm text-gray-500">Current</div>
            <div className={`text-xs ${isStable ? 'text-green-600' : 'text-red-600'}`}>
              {isStable ? 'Stable' : 'Unstable'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{brutoWeight} kg</div>
            <div className="text-sm text-gray-500">Bruto</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{tarraWeight} kg</div>
            <div className="text-sm text-gray-500">Tarra</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{nettoWeight} kg</div>
            <div className="text-sm text-gray-500">Netto</div>
          </div>
        </div>
      </div>

      {/* Current Batch */}
      {currentBatch && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Batch</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-500">Batch Name</label>
              <div className="font-medium">{currentBatch.batchName}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <div className={`font-medium ${
                currentBatch.status === 'pending' ? 'text-yellow-600' :
                currentBatch.status === 'ongoing' ? 'text-blue-600' :
                'text-green-600'
              }`}>
                {currentBatch.status.toUpperCase()}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Vehicle</label>
              <div className="font-medium">{currentBatch.vehicle?.plateNumber}</div>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            {currentBatch.status === 'pending' && (
              <button
                onClick={handleStartBatch}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Start Weighing
              </button>
            )}
            {currentBatch.status === 'ongoing' && (
              <button
                onClick={handleEndBatch}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                End Batch
              </button>
            )}
          </div>
        </div>
      )}

      {/* Create New Batch */}
      {!currentBatch && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Batch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch Name
              </label>
              <input
                type="text"
                value={formData.batchName}
                onChange={(e) => setFormData({ batchName: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter batch name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle
              </label>
              <select
                value={formData.vehicleId}
                onChange={(e) => setFormData({ vehicleId: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.plateNumber} - {vehicle.type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ supplierId: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material
              </label>
              <select
                value={formData.materialId}
                onChange={(e) => setFormData({ materialId: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select Material</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver Name
              </label>
              <input
                type="text"
                value={formData.driverName}
                onChange={(e) => setFormData({ driverName: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter driver name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ticket Number
              </label>
              <input
                type="text"
                value={formData.ticketNumber}
                onChange={(e) => setFormData({ ticketNumber: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter ticket number"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleCreateBatch}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Create Batch
            </button>
          </div>
        </div>
      )}

      {/* Shrinkage Warning */}
      {shrinkageData && (
        <div className={`rounded-lg p-4 mb-6 ${
          shrinkageData.warning ? 'bg-red-100 border border-red-300' : 'bg-green-100 border border-green-300'
        }`}>
          <h3 className="font-semibold mb-2">Shrinkage Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Shrinkage Value:</span>
              <span className="ml-2 font-medium">{shrinkageData.shrinkageValue} kg</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Shrinkage Percent:</span>
              <span className={`ml-2 font-medium ${
                shrinkageData.warning ? 'text-red-600' : 'text-green-600'
              }`}>
                {shrinkageData.shrinkagePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}