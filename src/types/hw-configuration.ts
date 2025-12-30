import { HwAreaEnum, HwDataConfig } from "@/entities/HwConfiguration.entity";

export interface HwConfigurationDto {
  id?: number;
  area: HwAreaEnum | null;
  dataConfig: HwDataConfig | null;
  createdBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
}

export interface UpsertHwConfigRequest {
  area: HwAreaEnum;
  dataConfig: HwDataConfig;
}

export interface HwConfigResponse {
  success: boolean;
  data?: HwConfigurationDto;
  message?: string;
}

export interface HwConfigListResponse {
  success: boolean;
  data?: HwConfigurationDto[];
  message?: string;
}