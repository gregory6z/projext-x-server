export interface Transaction {
  transactionId: number;
  accountId: number;
  type: string;
  amount: number;
  timestamp: Date;
}