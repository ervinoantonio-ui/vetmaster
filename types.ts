
export enum Species {
  BOVINE = 'Bovino',
  EQUINE = 'Equino',
  PORCINE = 'Suíno',
  OVINE = 'Ovino',
  CANINE = 'Cão',
  FELINE = 'Gato',
  OTHER = 'Outro'
}

export enum Category {
  LARGE = 'Grande Porte',
  DOMESTIC = 'Doméstico'
}

export interface Owner {
  id: string;
  name: string;
  phone: string;
  email?: string;
  farmName?: string;
  address?: string;
  createdAt: number;
}

export interface Animal {
  id: string;
  internalId: string; // Unique number
  name?: string;
  species: Species;
  category: Category;
  breed: string;
  sex: 'M' | 'F';
  birthDate?: string;
  ownerId: string;
  farmName?: string;
  notes?: string;
  createdAt: number;
}

export interface MedicalRecord {
  id: string;
  animalId: string;
  date: string;
  type: 'Vaccine' | 'Medication' | 'Procedure' | 'Diagnosis' | 'Note';
  title: string;
  description: string;
  medicationId?: string;
  dosage?: string;
  lot?: string;
  nextDoseDate?: string;
}

export interface Transaction {
  id: string;
  ownerId: string;
  animalId?: string;
  serviceName: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: 'PAID' | 'PENDING';
}

export interface InventoryItem {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: 'ml' | 'mg' | 'dose' | 'unidade';
  expiryDate: string;
  minStock: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  clinicName: string;
}
