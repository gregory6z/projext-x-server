import { InMemoryBankAccountsRepository } from "./../../../test/repositories/in-memory-bank-accounts-repository"
import { RegisterInvestmentPurchaseUseCase } from "./register-investment-purchase"
import { makeInvestment } from "test/factories/make-investment"
import { InMemoryInvestmentPurchaseRepository } from "test/repositories/in-memory-investment-purshase"
import { InMemoryInvestmentRepository } from "test/repositories/in-memory-investments-repository"
import { makeBankAccount } from "test/factories/make-bank-account"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"

let inMemoryInvestmentPurchaseRepository: InMemoryInvestmentPurchaseRepository
let inMemoryBankAccountsRepository: InMemoryBankAccountsRepository
let inMemoryInvestmentsRepository: InMemoryInvestmentRepository

let sut: RegisterInvestmentPurchaseUseCase

describe("Register Investment Purchase", () => {
  beforeEach(() => {
    inMemoryInvestmentPurchaseRepository =
      new InMemoryInvestmentPurchaseRepository()
    inMemoryBankAccountsRepository = new InMemoryBankAccountsRepository()
    inMemoryInvestmentsRepository = new InMemoryInvestmentRepository()

    sut = new RegisterInvestmentPurchaseUseCase(
      inMemoryInvestmentPurchaseRepository,
      inMemoryBankAccountsRepository,
      inMemoryInvestmentsRepository,
    )
  })

  it("should be able to register an investment purchase", async () => {
    const investment = makeInvestment()
    const account = makeBankAccount()

    inMemoryInvestmentsRepository.items.push(investment)
    inMemoryBankAccountsRepository.items.push(account)

    const result = await sut.execute({
      accountId: account.accountNumber.toString(),
      investmentId: investment.id.toString(),
      paymentType: "normal",
      initialAmount: 1000,
    })

    expect(result.isRight()).toBe(true)

    if ("investmentPurchase" in result.value) {
      const investmentPurchase = result.value.investmentPurchase

      expect(investmentPurchase.accountId).toEqual(account.accountNumber)
      expect(investmentPurchase.investmentId.toString()).toEqual(
        investment.id.toString(),
      )
      expect(investmentPurchase.paymentType).toEqual("normal")
      expect(investmentPurchase.initialAmount).toEqual(1000)
      expect(investmentPurchase.status).toEqual("pending")
    }

    // outros testes conforme necessário...
  })
  it("deve retornar um erro quando a conta bancária não for encontrada", async () => {
    // Não adicione nenhuma conta bancária, simulando uma situação onde a conta não existe

    const response = await sut.execute({
      accountId: "nonExistingAccountId",
      investmentId: "validInvestmentId", // Certifique-se de que este ID exista no repositório de investimentos se necessário
      paymentType: "normal",
      initialAmount: 1000,
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })
  it("deve retornar um erro quando o investimento não for encontrado", async () => {
    // Adicione uma conta bancária válida para passar pela primeira verificação
    // inMemoryBankAccountsRepository.add(
    //   makeBankAccount({ id: "validAccountId" }),
    // )

    const bankAccount = makeBankAccount()

    inMemoryBankAccountsRepository.items.push(bankAccount)

    // Não adicione nenhum investimento, simulando uma situação onde o investimento não existe

    const response = await sut.execute({
      accountId: bankAccount.id.toString(),
      investmentId: "nonExistingInvestmentId",
      paymentType: "normal",
      initialAmount: 1000,
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
