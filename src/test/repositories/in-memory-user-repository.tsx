import { User } from "@/domain/entities/user"
import { UsersRepository } from "@/domain/repositories/users-repository"

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []
  async create(User: User) {
    this.items.push(User)
  }

  async update(user: User): Promise<void> {
    const userIndex = this.items.findIndex((item) => item.id === user.id)

    if (userIndex === -1) {
      return
    }

    this.items[userIndex] = user
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((user) => user.id.toString() === id)
    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string) {
    const User = this.items.find((item) => item.email === email)

    if (!User) {
      return null
    }

    return User
  }
}
