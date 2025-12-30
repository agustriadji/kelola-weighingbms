export interface HwGeneralApiDto {
  id?: number;
  url: string;
  createdBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpsertHwGeneralApiRequest {
  url: string;
}

export interface HwGeneralApiResponse {
  success: boolean;
  data?: HwGeneralApiDto;
  message?: string;
}