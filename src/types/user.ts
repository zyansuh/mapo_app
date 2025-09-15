// 사용자 관련 타입 정의

import { BaseEntity, UserRole } from "./common";

export interface User extends BaseEntity {
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  preferences?: UserPreferences;
  settings?: UserSettings;
}

export interface UserPreferences {
  theme: "light" | "dark" | "auto";
  language: "ko" | "en";
  notifications: NotificationSettings;
  dashboard: DashboardSettings;
}

export interface UserSettings {
  autoSync: boolean;
  syncInterval: number; // minutes
  offlineMode: boolean;
  dataRetention: number; // days
  backupEnabled: boolean;
  backupFrequency: "daily" | "weekly" | "monthly";
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  deliveryUpdates: boolean;
  invoiceReminders: boolean;
  systemAlerts: boolean;
}

export interface DashboardSettings {
  defaultView: "grid" | "list";
  itemsPerPage: number;
  showFavorites: boolean;
  showRecent: boolean;
  quickActions: string[];
}

export interface UserProfile extends User {
  avatar?: string;
  bio?: string;
  company?: string;
  position?: string;
  address?: string;
  website?: string;
  socialLinks?: SocialLinks;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  entityType: "company" | "delivery" | "invoice" | "product";
  entityId: string;
  details?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken?: string;
  expiresAt: Date;
  createdAt: Date;
  lastActivity: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

export interface UserStats {
  totalCompanies: number;
  totalDeliveries: number;
  totalInvoices: number;
  totalProducts: number;
  lastActivity: Date;
  loginCount: number;
  sessionDuration: number; // average in minutes
}
