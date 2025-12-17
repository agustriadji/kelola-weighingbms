export enum StatusBookEnum {
  AVAILABLE = 'AVAILABLE',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

export enum StatusMemberEnum {
  SUSPEND = 'SUSPEND',
  ACTIVE = 'ACTIVE',
}

export enum LendingEnum {
  BORROW = 'BORROW',
  RETURN = 'RETURN',
  LATE = 'LATE',
}

export enum DurationEnum {
  _3DAY = '3DAY',
  _1WEEK = '1WEEK',
  _2WEEK = '2WEEK',
  _1MONTH = '1MONTH',
}

export enum TierMemberEnum {
  NEW = 'NEW',
  VERIFIED = 'VERIFIED',
}

export const defaultLateFee = 5000;

export const cacheTime = 1000 * 60 * 5;

export enum RoleEnum {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  USER = 'USER',
}

export enum DocumentTypeEnum {
  SJ = 'Surat Jalan',
  DO = 'Delivery Order',
  PO = 'Purchase Order',
}

export enum SealConditionEnum {
  OK = 'ok',
  BROKEN = 'broken',
  MISSING = 'missing',
}

export enum DefaultUserEnum {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  OPERATOR_REGISTERING = 'operator_registering',
  OPERATOR_WEIGHING_IN = 'operator_weighing_in',
  OPERATOR_WEIGHING_OUT = 'operator_weighing_out',
  VIEWER = 'viewer',
}

export enum DefaulRoleEnum {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  OPERATOR_REGISTERING = 'operator_registering',
  OPERATOR_WEIGHING_IN = 'operator_weighing_in',
  OPERATOR_WEIGHING_OUT = 'operator_weighing_out',
  VIEWER = 'viewer',
}

export enum DefaultPermissionEnum {
  VIEW_DASHBOARD = 'view_dashboard',
  VIEW_INCOMING = 'view_incoming',
  CREATE_INCOMING = 'create_incoming',
  UPDATE_INCOMING = 'update_incoming',
  DELETE_INCOMING = 'delete_incoming',
  VIEW_OUTGOING = 'view_outgoing',
  CREATE_OUTGOING = 'create_outgoing',
  UPDATE_OUTGOING = 'update_outgoing',
  DELETE_OUTGOING = 'delete_outgoing',
  VIEW_MISC = 'view_misc',
  CREATE_MISC = 'create_misc',
  UPDATE_MISC = 'update_misc',
  DELETE_MISC = 'delete_misc',
  VIEW_WEIGHING = 'view_weighing',
  CREATE_WEIGHING = 'create_weighing',
  UPDATE_WEIGHING = 'update_weighing',
  DELETE_WEIGHING = 'delete_weighing',
  POS_WEIGHINGIN = 'pos_weighingin',
  POS_WEIGHINGOUT = 'pos_weighingout',
  VIEW_USERS = 'view_users',
  CREATE_USERS = 'create_users',
  UPDATE_USERS = 'update_users',
  DELETE_USERS = 'delete_users',
  VIEW_REPORTS = 'view_reports',
  EXPORT_REPORTS = 'export_reports',
  MANAGE_SYSTEM = 'manage_system',
}
