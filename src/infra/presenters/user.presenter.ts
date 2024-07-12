import { User } from "@/domain/entities/user"

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      isAdmin: user.isAdmin,
      birthDate: user.birthDate,
      email: user.email,
      phone: user.phone,
    }
  }
}
