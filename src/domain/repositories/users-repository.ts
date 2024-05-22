import { User } from "../entities/user"

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>
  abstract update(user: User): Promise<void>

  abstract findById(id: string): Promise<User | null>
  abstract findByEmail(email: string): Promise<User | null>
}
