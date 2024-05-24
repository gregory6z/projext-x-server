import { AggregateRoot } from "@/core/entities/aggregate-root"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface ExternalBankProps {
  userId: string
  accountHolderName: string
  accountNumber: string
  iban: string
  bic: string
}

export class ExternalBank extends AggregateRoot<ExternalBankProps> {
  get userId(): string {
    return this.props.userId
  }

  get accountHolderName(): string {
    return this.props.accountHolderName
  }

  get accountNumber(): string {
    return this.props.accountNumber
  }

  get iban(): string {
    return this.props.iban
  }

  get bic(): string {
    return this.props.bic
  }

  static create(props: ExternalBankProps, id?: UniqueEntityID) {
    const externalBank = new ExternalBank(props, id)

    return externalBank
  }
}
