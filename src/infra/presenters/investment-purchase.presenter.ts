import { InvestmentPurchase } from "@prisma/client"

export class InvestmentPurchasePresenter {
  static toHTTP(investmentPurchase: InvestmentPurchase) {
    return {
      id: investmentPurchase.id.toString(),

      accountId: investmentPurchase.accountId,
      investmentId: investmentPurchase.investmentId,
      paymentType: investmentPurchase.paymentType,
      status: investmentPurchase.status,
      initialAmount: investmentPurchase.initialAmount,
      totalAmount: investmentPurchase.totalAmount,
      amountProfits: investmentPurchase.amountProfits,

      createdAt: investmentPurchase.createdAt,
      updatedAt: investmentPurchase.updatedAt,
    }
  }
}
