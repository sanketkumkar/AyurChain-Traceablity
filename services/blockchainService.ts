
import { Block, Transaction, TransactionType } from '../types';

// Using the browser's built-in SubtleCrypto API for SHA-256 hashing.
const calculateHash = async (data: string): Promise<string> => {
  const buffer = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const createGenesisBlock = async (): Promise<Block> => {
  const timestamp = new Date().getTime();
  const transaction: Transaction = {
    type: TransactionType.GENESIS,
    data: { message: 'Genesis Block' },
  };
  const previousHash = '0';
  const blockDataString = timestamp + JSON.stringify(transaction) + previousHash;
  const hash = await calculateHash(blockDataString);
  const id = hash.substring(0, 8);

  return {
    id,
    timestamp,
    transaction,
    previousHash,
    hash,
  };
};

export const createBlock = async (transaction: Transaction, previousBlock: Block): Promise<Block> => {
  const timestamp = new Date().getTime();
  const previousHash = previousBlock.hash;
  const blockDataString = timestamp + JSON.stringify(transaction) + previousHash;
  const hash = await calculateHash(blockDataString);
  const id = hash.substring(0, 8); // Use first 8 chars of hash as a short ID

  return {
    id,
    timestamp,
    transaction,
    previousHash,
    hash,
  };
};
