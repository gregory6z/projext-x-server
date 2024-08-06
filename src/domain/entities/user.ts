import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { BankAccount } from "./bank-account"

export interface UserProps {
  firstName: string
  lastName: string
  address: string
  isAdmin: boolean
  birthDate: Date
  email: string
  phone: string
  password: string

  customerId: string | null

  bankAccount: BankAccount | null
}

export class User extends Entity<UserProps> {
  get firstName(): string {
    return this.props.firstName
  }

  get customerId(): string | null {
    return this.props.customerId
  }

  set customerId(value: string) {
    this.props.customerId = value
  }

  get bankAccount(): BankAccount | null {
    return this.props.bankAccount
  }

  set bankAccount(account: BankAccount) {
    this.props.bankAccount = account
  }

  get isAdmin(): boolean {
    return this.props.isAdmin
  }

  get password(): string {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get lastName(): string {
    return this.props.lastName
  }

  get address(): string {
    return this.props.address
  }

  set address(address: string) {
    this.props.address = address
  }

  get birthDate(): Date {
    return this.props.birthDate
  }

  get email(): string {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
  }

  get phone(): string {
    return this.props.phone
  }

  set phone(phone: string) {
    this.props.phone = phone
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    const user = new User(
      {
        ...props,
        isAdmin: props.isAdmin ?? false,
        bankAccount: props.bankAccount ?? null,
        customerId: props.customerId ?? null,
      },
      id,
    )

    return user
  }
}
