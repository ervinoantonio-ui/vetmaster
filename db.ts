
import { Animal, Owner, MedicalRecord, Transaction, InventoryItem, User } from './types';

const STORAGE_KEYS = {
  ANIMALS: 'vetmaster_animals',
  OWNERS: 'vetmaster_owners',
  HISTORY: 'vetmaster_history',
  FINANCE: 'vetmaster_finance',
  INVENTORY: 'vetmaster_inventory',
  USER: 'vetmaster_user'
};

export const db = {
  getAnimals: (): Animal[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.ANIMALS) || '[]'),
  saveAnimals: (data: Animal[]) => localStorage.setItem(STORAGE_KEYS.ANIMALS, JSON.stringify(data)),
  
  getOwners: (): Owner[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.OWNERS) || '[]'),
  saveOwners: (data: Owner[]) => localStorage.setItem(STORAGE_KEYS.OWNERS, JSON.stringify(data)),
  
  getHistory: (): MedicalRecord[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]'),
  saveHistory: (data: MedicalRecord[]) => localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data)),
  
  getFinance: (): Transaction[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.FINANCE) || '[]'),
  saveFinance: (data: Transaction[]) => localStorage.setItem(STORAGE_KEYS.FINANCE, JSON.stringify(data)),
  
  getInventory: (): InventoryItem[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.INVENTORY) || '[]'),
  saveInventory: (data: InventoryItem[]) => localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(data)),
  
  getUser: (): User | null => JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null'),
  saveUser: (data: User | null) => localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data))
};

// Initial data if empty
if (db.getAnimals().length === 0 && db.getOwners().length === 0) {
  const mockOwner: Owner = { id: '1', name: 'João Silva', phone: '(11) 99999-9999', farmName: 'Fazenda Esperança', createdAt: Date.now() };
  db.saveOwners([mockOwner]);
  db.saveAnimals([
    {
      id: 'a1',
      internalId: '1001',
      name: 'Mimosa',
      species: 'Bovino' as any,
      category: 'Grande Porte' as any,
      breed: 'Nelore',
      sex: 'F',
      ownerId: '1',
      farmName: 'Fazenda Esperança',
      createdAt: Date.now()
    }
  ]);
  db.saveInventory([
    { id: 'i1', name: 'Vacina Febre Aftosa', type: 'Vacina', quantity: 5, unit: 'dose', expiryDate: '2025-12-31', minStock: 10 }
  ]);
}
