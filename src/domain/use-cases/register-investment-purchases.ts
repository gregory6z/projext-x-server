// import { InMemoryBankAccountsRepository } from "@/test/repositories/in-memory-bank-accounts-repository"
// import { RegisterInvestmentPurchaseUseCase } from "./register-investment-purchase"
// import { makeInvestment } from "@/test/factories/make-investment"
// import { InMemoryInvestmentPurchaseRepository } from "@/test/repositories/in-memory-investment-purshase"

// let inMemoryInvestmentPurchaseRepository: InMemoryInvestmentPurchaseRepository
// let inMemoryBankAccountsRepository: InMemoryBankAccountsRepository
// let inMemoryInvestmentsRepository: InMemoryInvestmentPurchaseRepository

// let sut: RegisterInvestmentPurchaseUseCase

// describe("Register Investment Purchase", () => {
//   beforeEach(() => {
//     inMemoryInvestmentPurchaseRepository =
//       new InMemoryInvestmentPurchaseRepository()
//     inMemoryBankAccountsRepository = new InMemoryBankAccountsRepository()
//     inMemoryInvestmentsRepository = new InMemoryInvestmentPurchaseRepository()

//     sut = new RegisterInvestmentPurchaseUseCase(
//       inMemoryInvestmentPurchaseRepository,
//       inMemoryBankAccountsRepository,
//       inMemoryInvestmentsRepository,
//     )
//   })

//   it("should be able to register an investment purchase", async () => {
//     const investment = makeInvestment()

//     const result = await sut.execute({
//       accountId: bankAccount.id,
//       investmentId: investment.id,
//       paymentType: "normal",
//       initialAmount: 1000,
//     })

//     expect(result.isRight()).toBe(true)
//     const investmentPurchase = result.value.investmentPurchase

//     expect(investmentPurchase.accountId).toEqual(bankAccount.id)
//     expect(investmentPurchase.investmentId).toEqual(investment.id)
//     expect(investmentPurchase.paymentType).toEqual("normal")
//     expect(investmentPurchase.initialAmount).toEqual(1000)
//     expect(investmentPurchase.status).toEqual("pending")
//   })

//   // outros testes conforme necessário...
// })
