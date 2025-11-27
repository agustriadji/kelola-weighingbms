export interface WeighingData {
  id?: number
  registerId: string
  tiketNumber: string
  driverName: string
  vehicleType: string
  container: string
  transporter: string
  vesselName: string
  contractSO: string
  doNumber: string
  poNumber: string
  product: string
  destination: string
  supplier: string
  millOriginal: string
  bruttoSupplier: number
  tarraSupplier: number
  nettoSupplier: number
  sealNumber: string
  simNumber: string
  nettoEvyap: number
  susutGainNetto: number
  presentaseNetto: number
  remarks: string
  operatorName: string
  createdAt?: Date
  updatedAt?: Date
}

export interface WeighingResponse {
  success: boolean
  data?: WeighingData
  message?: string
}

export class WeighingService {
  private static instance: WeighingService

  static getInstance(): WeighingService {
    if (!WeighingService.instance) {
      WeighingService.instance = new WeighingService()
    }
    return WeighingService.instance
  }

  async saveWeighingData(data: WeighingData): Promise<WeighingResponse> {
    try {
      // Validate input
      const validation = this.validateWeighingData(data)
      if (!validation.isValid) {
        return { success: false, message: validation.message }
      }

      // In real implementation, save to database
      const weighingRecord = {
        ...data,
        id: Date.now(), // Mock ID
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Mock save to localStorage for demo
      const existingRecords = this.getStoredRecords()
      existingRecords.push(weighingRecord)
      localStorage.setItem('weighingRecords', JSON.stringify(existingRecords))

      return {
        success: true,
        data: weighingRecord,
        message: 'Weighing data saved successfully'
      }
    } catch (error) {
      return { success: false, message: 'Error saving weighing data' }
    }
  }

  async getWeighingHistory(vehicleNumber?: string): Promise<WeighingResponse[]> {
    try {
      const records = this.getStoredRecords()
      
      let filteredRecords = records
      if (vehicleNumber) {
        // In real implementation, filter by vehicle number from database
        filteredRecords = records.filter(r => 
          r.registerId.includes(vehicleNumber) || 
          r.tiketNumber.includes(vehicleNumber)
        )
      }

      return filteredRecords.map(record => ({
        success: true,
        data: record
      }))
    } catch (error) {
      return []
    }
  }

  async calculateWeights(brutto: number, tarra: number): Promise<{
    netto: number
    susutGain: number
    percentage: number
  }> {
    const netto = brutto - tarra
    const susutGain = 0 // Calculate based on business rules
    const percentage = netto > 0 ? (susutGain / netto) * 100 : 0

    return {
      netto,
      susutGain,
      percentage: Math.round(percentage * 100) / 100
    }
  }

  async getVehicleHistory(vehicleNumber: string): Promise<WeighingData[]> {
    try {
      const records = this.getStoredRecords()
      return records
        .filter(r => r.registerId === vehicleNumber)
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
        .slice(0, 10) // Last 10 records
    } catch (error) {
      return []
    }
  }

  async getTarraHistory(vehicleNumber: string): Promise<{
    vehicleNumber: string
    tarraAwal: number
    tarraTerendah: number
    tarraTertinggi: number
  }[]> {
    try {
      const records = this.getStoredRecords()
      const vehicleRecords = records.filter(r => r.registerId === vehicleNumber)
      
      if (vehicleRecords.length === 0) return []

      const tarraValues = vehicleRecords.map(r => r.tarraSupplier)
      
      return [{
        vehicleNumber,
        tarraAwal: tarraValues[0] || 0,
        tarraTerendah: Math.min(...tarraValues),
        tarraTertinggi: Math.max(...tarraValues)
      }]
    } catch (error) {
      return []
    }
  }

  private validateWeighingData(data: WeighingData): { isValid: boolean; message?: string } {
    if (!data.registerId?.trim()) {
      return { isValid: false, message: 'Register ID is required' }
    }
    
    if (!data.tiketNumber?.trim()) {
      return { isValid: false, message: 'Tiket Number is required' }
    }
    
    if (!data.driverName?.trim()) {
      return { isValid: false, message: 'Driver Name is required' }
    }
    
    if (!data.vehicleType?.trim()) {
      return { isValid: false, message: 'Vehicle Type is required' }
    }
    
    if (!data.transporter?.trim()) {
      return { isValid: false, message: 'Transporter is required' }
    }
    
    if (!data.contractSO?.trim()) {
      return { isValid: false, message: 'Contract/SO is required' }
    }
    
    if (!data.product?.trim()) {
      return { isValid: false, message: 'Product is required' }
    }
    
    if (!data.supplier?.trim()) {
      return { isValid: false, message: 'Supplier is required' }
    }
    
    if (!data.operatorName?.trim()) {
      return { isValid: false, message: 'Operator Name is required' }
    }

    return { isValid: true }
  }

  private getStoredRecords(): WeighingData[] {
    try {
      const stored = localStorage.getItem('weighingRecords')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }
}