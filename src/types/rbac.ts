export interface Permission {
  id: number
  name: string
}

export interface Role {
  id: number
  name: string
  permissions: Permission[]
}

export interface User {
  id: number
  username: string
  fullName: string
  role: Role
  lastLogin?: Date
}

export enum Permissions {
  // Dashboard
  VIEW_DASHBOARD = 'view_dashboard',
  
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
  OPERATOR = 'Operator',
  VIEWER = 'Viewer'
}