export interface Investment {
  name: string;
  description: string;
  imageUrl: string;
  investmentId: number;
  accountId: number;
  investmentType: string;
  amount: number;
  quantity: number;
  purchasePricePerUnit: number;
  currentPricePerUnit: number;
  timestamp: Date;
  annualProfit: number;
  risk: string;
  term: string;
  paymentMethod: string;
  fundraisingProgress: number;
  releaseDate: Date;
}