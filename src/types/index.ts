export type UnitType = 'mudu' | 'cup' | 'paint_rubber' | 'carton' | 'piece' | 'pack' | 'kg';

export interface Sale {
  id?: number;
  amount: number; // in integer kobo (e.g. 20000 = ₦200)
  itemName: string;
  category: string;
  paymentStatus: 'paid' | 'owing';
  paymentMethod: 'cash' | 'transfer' | 'other';
  debtorName?: string;
  debtorPhone?: string;
  inventoryItemId?: number;
  quantity?: number;
  createdAt: string; // ISO string
  notes?: string;
}

export interface Expense {
  id?: number;
  amount: number; // in integer kobo
  description: string;
  expenseType: 'restock' | 'chop_money'; // Business Seed vs Personal Upkeep
  category: string;
  createdAt: string;
  notes?: string;
}

export interface InventoryItem {
  id?: number;
  name: string;
  unit: UnitType;
  quantity: number;
  costPrice: number; // in integer kobo
  sellingPrice: number; // in integer kobo
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  id?: number;
  userName?: string;
  hustleName: string;
  location?: string; // e.g. "Minna", "Lagos", "Hostel"
  inventoryEnabled: boolean;
  summaryEnabled: boolean;
  currency: string;
  storageMode: 'local' | 'cloud';
  hasCompletedOnboarding: boolean;
}
