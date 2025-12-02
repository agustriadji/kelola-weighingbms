export interface Permission {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: Role;
  lastLogin?: Date;
}

export enum Permissions {
  // Dashboard
  VIEW_DASHBOARD = 'view_dashboard',

  // INCOMING
  VIEW_INCOMING = 'view_incoming',
  CREATE_INCOMING = 'create_incoming',
  UPDATE_INCOMING = 'update_incoming',
  DELETE_INCOMING = 'delete_incoming',

  // OUTGOING
  VIEW_OUTGOING = 'view_outgoing',
  CREATE_OUTGOING = 'create_outgoing',
  UPDATE_OUTGOING = 'update_outgoing',
  DELETE_OUTGOING = 'delete_outgoing',

  // MISC
  VIEW_MISC = 'view_misc',
  CREATE_MISC = 'create_misc',
  UPDATE_MISC = 'update_misc',
  DELETE_MISC = 'delete_misc',

  // Weighing
  VIEW_WEIGHING = 'view_weighing',
  CREATE_WEIGHING = 'create_weighing',
  UPDATE_WEIGHING = 'update_weighing',
  DELETE_WEIGHING = 'delete_weighing',

  // Users
  VIEW_USERS = 'view_users',
  CREATE_USERS = 'create_users',
  UPDATE_USERS = 'update_users',
  DELETE_USERS = 'delete_users',

  // Reports
  VIEW_REPORTS = 'view_reports',
  EXPORT_REPORTS = 'export_reports',

  // System
  MANAGE_SYSTEM = 'manage_system',
}

export enum Roles {
  ADMIN = 'Admin',
  SUPERVISOR = 'Supervisor',
  OPERATOR_WEIGHING = 'Operator Weighing',
  OPERATOR_REGISTER = 'Operator Registering',
  VIEWER = 'Viewer',
}
