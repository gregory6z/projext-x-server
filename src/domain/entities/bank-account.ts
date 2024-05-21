import { ExternalBank } from "./external-bank";
import { Transaction } from "./transaction";

export interface BankAccount {
  accountId: number;
  userId: number;
  accountNumber: string;
  accountHolderID: string;
  balance: number;
  transactions: Transaction[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
  investments: [];
  externalBanks: ExternalBank[];
}