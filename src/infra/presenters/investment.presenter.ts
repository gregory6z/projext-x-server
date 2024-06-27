import { Investment } from "@/domain/entities/investment"

export class InvestmentPresenter {
  static toHTTP(question: Investment) {
    return {
      id: question.id.toString(),
      name: question.name,
      description: question.description,
      imageUrl: question.imageUrl,
      investmentType: question.investmentType,
      annualProfit: question.annualProfit,
      fundraisingProgress: question.fundraisingProgress,
      term: question.term,
      risk: question.risk,

      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
