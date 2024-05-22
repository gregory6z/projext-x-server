import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Investment } from "./investment"
import { BankAccount } from "./bank-account"

export interface UserProps {
  firstName: string
  lastName: string
  address: string
  birthDate: Date
  email: string
  phone: string
  password: string
  investments: Investment[] | null
  account: BankAccount | null
}

export class User extends Entity<UserProps> {
  get firstName(): string {
    return this.props.firstName
  }

  get password(): string {
    return this.props.password
  }

  get lastName(): string {
    return this.props.lastName
  }

  get address(): string {
    return this.props.address
  }

  get birthDate(): Date {
    return this.props.birthDate
  }

  get email(): string {
    return this.props.email
  }

  get phone(): string {
    return this.props.phone
  }

  get investments(): Investment[] | null {
    return this.props.investments || null
  }

  get account(): BankAccount | null {
    return this.props.account || null
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    const user = new User(props, id)

    return user
  }
}
