import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import dayjs from "dayjs"
import { AccountNumber } from "./value-objects/account-number"
import { Entity } from "@/core/entities/entity"
import { Investment } from "./investment"

export interface BankAccountProps {
  userId: string
  accountNumber: string

  balance: number

  availableWithdrawal: number // dinheiro disponível para saque

  createdAt: Date
  updatedAt?: Date | null
}

export interface BankAccountCreationProps {
  userId: string
  accountNumber?: string
  balance?: number
  createdAt?: Date

  availableWithdrawal?: number

  investments?: Investment[]
}

export class BankAccount extends Entity<BankAccountProps> {
  get userId(): string {
    return this.props.userId
  }

  get availableWithdrawal(): number {
    return this.props.availableWithdrawal
  }

  set availableWithdrawal(value: number) {
    this.props.availableWithdrawal = value
    this.touch()
  }

  get accountNumber(): string {
    return this.props.accountNumber
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt ?? null
  }

  get balance(): number {
    return this.props.balance
  }

  set balance(value: number) {
    this.props.balance = value
    this.touch()
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, "days") <= 3
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: BankAccountCreationProps, id?: UniqueEntityID) {
    const defaultProps: BankAccountProps = {
      accountNumber:
        props.accountNumber ??
        AccountNumber.createAccountNumber(props.userId).value,
      balance: props.balance ?? 0,
      createdAt: props.createdAt ?? new Date(),
      userId: props.userId,
      availableWithdrawal: props.availableWithdrawal ?? 0,
    }

    return new BankAccount(defaultProps, id)
  }
}
