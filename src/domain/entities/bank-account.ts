import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import dayjs from "dayjs"
import { AccountNumber } from "./value-objects/account-number"
import { Entity } from "@/core/entities/entity"

export interface BankAccountProps {
  userId: string
  accountNumber: string
  balance: number

  createdAt: Date
  updatedAt?: Date | null
}

export interface BankAccountCreationProps {
  userId: string
  accountNumber?: string
  balance?: number
  createdAt?: Date
}

export class BankAccount extends Entity<BankAccountProps> {
  get userId(): string {
    return this.props.userId
  }

  get accountNumber(): string {
    return this.props.accountNumber
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
    }

    return new BankAccount(defaultProps, id)
  }
}
