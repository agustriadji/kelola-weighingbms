import { DocumentTypeEnum, SealConditionEnum } from './constanta';

export interface InboundType {
  id?: number;
  rfid: string;
  vehicleNumber: string;
  driverName: string;
  driverId: string;
  transporter: string;

  documentType: DocumentTypeEnum;
  sjNumber?: string;
  poNumber?: string;
  doNumber?: string;

  material: string;
  expectedQuantity?: number;
  actualQuantity?: number;
  uom?: string;

  sealNumber: string;
  sealCondition: SealConditionEnum;

  doorLocked: boolean | false;
  noLeakage: boolean | false;
  loadVisible: boolean | false;

  batchNumber: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export enum DocumentWbState {
  WEIGHING_QUEUE = 'WEIGHING_QUEUE',
  YARD_QUEUE = 'YARD',
  WB_REJECT = 'WB_REJECT',
  CLOSE_WB = 'CLOSE_WB',
}

export const InboundStatus = {
  REGISTERED: 'registered',
  QUEUE_IN: 'queue-weigh-in',
  WEIGHING_IN: 'weighing-in',
  WEIGHED_IN: 'weighed-in',
  YARD: 'yard-processing',
  QUEUE_OUT: 'queue-weigh-out',
  WEIGHING_OUT: 'weighing-out',
  WEIGHED_OUT: 'weighed-out',
  FINISHED: 'finished',
};

export interface ListDocumentState {
  id: number;
  inbound_id: number;
  transaction_id: string;
  vehicle_number: string;
  contract_number: string;
  material: string;
  relation_name: string;
  transporter: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface WeighingFormData {
  batchName: string;
  vehicleId: string;
  supplierId: string;
  materialId: string;
  driverName: string;
  ticketNumber: string;
}

export interface WeighingState {
  // Time
  currentTime: string;

  // Master Data
  suppliers: any[];
  materials: any[];
  vehicles: any[];

  // Batch Data
  batches: any[];
  batchId: number | null;
  currentBatch: any | null;

  // Weight Data
  currentWeight: number;
  isStable: boolean;
  weightHistory: any[];
  brutoWeight: number;
  tarraWeight: number;
  nettoWeight: number;
  expectedNetto: number;
  shrinkageData: any | null;

  // Vehicle Data
  vehicleHistory: any[];
  tarraHistory: any | null;

  // Form Data
  formData: WeighingFormData;

  // Document Data
  listDocument: ListDocumentState[];

  // Loading States
  isLoading: boolean;
  isInitialized: boolean;

  // Cache States
  lastDocumentType: string | null;
  documentCacheTime: number;

  // Actions
  setCurrentTime: (time: string) => void;
  setMasterData: (suppliers: any[], materials: any[], vehicles: any[]) => void;
  setBatches: (batches: any[]) => void;
  setCurrentBatch: (batch: any | null) => void;
  setWeightData: (
    data: Partial<
      Pick<
        WeighingState,
        | 'currentWeight'
        | 'isStable'
        | 'brutoWeight'
        | 'tarraWeight'
        | 'nettoWeight'
        | 'expectedNetto'
      >
    >
  ) => void;
  addWeightHistory: (record: any) => void;
  setVehicleData: (history: any[], tarra: any) => void;
  setShrinkageData: (data: any) => void;
  setFormData: (data: Partial<WeighingFormData>) => void;
  setListDocument: (data: ListDocumentState[]) => void;
  setBatchId: (id: number | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setCacheInfo: (type: string, time: number) => void;
  resetWeights: () => void;
  resetForm: () => void;
  saveWeightState: (brutoWeight: number) => any;
}
