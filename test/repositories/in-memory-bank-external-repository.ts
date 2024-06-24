import { ExternalBank } from "@/domain/entities/external-bank"
import { ExternalBanksRepository } from "@/domain/repositories/external-banks-repository"

export class InMemoryExternalBankRepository implements ExternalBanksRepository {
  public items: ExternalBank[] = []

  async create(externalBank: ExternalBank) {
    this.items.push(externalBank)
  }

  async delete(externalBank: ExternalBank) {
    const externalBankIndex = this.items.findIndex(
      (item) => item.id === externalBank.id,
    )
    this.items.splice(externalBankIndex, 1)
  }

  async findById(externalBankId: string) {
    const externalBank = this.items.find(
      (item) => item.id.toString() === externalBankId,
    )

    if (!externalBank) {
      return null
    }

    return externalBank
  }
}
