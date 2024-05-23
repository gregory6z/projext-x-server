export class AccountNumber {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string) {
    return new AccountNumber(value)
  }

  /**
   * Receives a string and normalize it as a slug.
   *
   * Example: "An example title" => "an-example-title"
   *
   * @param text {string}
   */
  static createAccountNumber(userId: string): AccountNumber {
    let hash = 0
    const userIdString = userId.toString() // Convert userId to string
    for (let i = 0; i < userIdString.length; i++) {
      const char = userIdString.charCodeAt(i) // Use charCodeAt on userIdString
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }

    const accountNumber = "00000000" + Math.abs(hash).toString()
    const finalAccountNumber = accountNumber.substring(accountNumber.length - 8)

    return new AccountNumber(finalAccountNumber)
  }
}
