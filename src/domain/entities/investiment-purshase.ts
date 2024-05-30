export interface InvestmentPurchase {
  accountId: number
  investmentId: number

  InitialAmount: number

  paymentType: "normal" | "subscription"
  status: "pending" | "completed" | "failed"

  stripeCustomerId: string
  stripeSubscriptionId?: string

  createdAt: Date
  updatedAt?: Date | null
}
