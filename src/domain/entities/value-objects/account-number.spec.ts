import { AccountNumber } from "./account-number"

describe("AccountNumber", () => {
  it("should create an account number with the provided value", () => {
    const accountNumber = AccountNumber.create("12345678")

    expect(accountNumber.value).toEqual("12345678")
  })

  it("should create an account number based on a user ID", () => {
    const accountNumber = AccountNumber.createAccountNumber("testUserId")

    // O número da conta é baseado em um hash do ID do usuário, então não podemos prever o valor exato
    // Mas podemos verificar se ele tem o formato correto
    expect(accountNumber.value).toMatch(/^[0-9]{8}$/)
  })
})
