import Dexie, { type Table } from 'dexie';
import { Sale, Expense, InventoryItem, UserSettings } from '@/types';

export const DEFAULT_SETTINGS: UserSettings = {
  userName: 'Friend',
  hustleName: 'My Store',
  inventoryEnabled: true,
  summaryEnabled: false, // Off by default
  currency: 'NGN',
  storageMode: 'local',
  hasCompletedOnboarding: false,
};

export class BookrDatabase extends Dexie {
  sales!: Table<Sale, number>;
  expenses!: Table<Expense, number>;
  inventory!: Table<InventoryItem, number>;
  settings!: Table<UserSettings, number>;

  constructor() {
    super('BookrDB');

    this.version(1).stores({
      sales: '++id, amount, itemName, paymentStatus, debtorName, createdAt',
      expenses: '++id, amount, expenseType, createdAt',
      inventory: '++id, name, unit, quantity',
      settings: '++id',
    });

    // Populate initial settings ONCE upon DB creation
    this.on('populate', () => {
      this.settings.add({ ...DEFAULT_SETTINGS });
    });
  }
}

export const db = new BookrDatabase();

// Pure read helper
export async function getSettings(): Promise<UserSettings> {
  try {
    const item = await db.settings.toCollection().first();
    if (item) return item;
    // Fallback if populate hasn't run yet
    const id = await db.settings.add({ ...DEFAULT_SETTINGS });
    return { ...DEFAULT_SETTINGS, id };
  } catch (err) {
    console.error('Error loading settings:', err);
    return DEFAULT_SETTINGS;
  }
}

// Update helper
export async function updateSettings(updates: Partial<UserSettings>): Promise<void> {
  try {
    const item = await db.settings.toCollection().first();
    if (item && item.id) {
      await db.settings.update(item.id, updates);
    } else {
      await db.settings.add({ ...DEFAULT_SETTINGS, ...updates });
    }
  } catch (err) {
    console.error('Error updating settings:', err);
  }
}
