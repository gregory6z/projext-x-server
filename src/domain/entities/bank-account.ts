import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ExternalBank } from "./external-bank"
import { Transaction } from "./transaction"

export interface BankAccountProps {
  accountId: number
  userId: number
  accountNumber: string
  accountHolderID: string
  balance: number
  transactions: Transaction[]
  status: string
  createdAt: Date
  updatedAt: Date
  investments: []
  externalBanks: ExternalBank[]
}

export class BankAccount extends Entity<BankAccountProps> {
  get accountId(): number {
    return this.props.accountId
  }

  get userId(): number {
    return this.props.userId
  }

  get accountNumber(): string {
    return this.props.accountNumber
  }

  get accountHolderID(): string {
    return this.props.accountHolderID
  }

  get balance(): number {
    return this.props.balance
  }

  get transactions(): Transaction[] {
    return this.props.transactions
  }

  get status(): string {
    return this.props.status
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  get investments(): [] {
    return this.props.investments
  }

  get externalBanks(): ExternalBank[] {
    return this.props.externalBanks
  }

  static create(props: BankAccountProps, id?: UniqueEntityID) {
    const bankAccount = new BankAccount(props, id)

    return bankAccount
  }
}
