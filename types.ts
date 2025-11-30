
export interface GeoLocation {
  lat: number;
  lon: number;
}

export enum TransactionType {
  GENESIS = 'GENESIS',
  COLLECTION = 'COLLECTION',
  PROCESSING = 'PROCESSING',
  FORMULATION = 'FORMULATION',
}

export interface CollectionData {
  herbName: string;
  quantity: number; // in kg
  collector: string;
  location: GeoLocation;
  collectionDate: string;
}

export interface ProcessingData {
  processor: string;
  processType: string; // e.g., 'Dried', 'Powdered'
  outputQuantity: number;
  processDate: string;
}

export interface FormulationData {
  productName: string;
  manufacturer: string;
  formulationDate: string;
  inputBatchIds: string[];
}

export type TransactionData = CollectionData | ProcessingData | FormulationData | { message: string };

export interface Transaction {
  type: TransactionType;
  data: TransactionData;
  batchId?: string; // Links processing steps to a specific batch
}

export interface Block {
  id: string;
  timestamp: number;
  transaction: Transaction;
  previousHash: string;
  hash: string;
}

export interface HerbBatch {
  id: string; // ID of the initial collection block
  herbName: string;
  status: string; // e.g., 'Collected', 'Dried', 'Powdered'
  history: string[]; // Array of block IDs
  currentOwner: string;
}

export interface FinalProduct {
    id: string; // ID of the formulation block
    productName: string;
    manufacturer: string;
    history: string[]; // Combined history of formulation and input batches
    inputBatchIds: string[];
}

export enum UserRole {
  FARMER = 'farmer',
  CONSUMER = 'consumer',
}

export interface User {
  name: string;
  role: UserRole;
}
