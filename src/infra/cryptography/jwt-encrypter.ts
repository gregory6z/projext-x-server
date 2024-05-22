// import { Encrypter } from "@/core/cryptography/encrypter"

// export class JwtEncrypter implements Encrypter {
//   constructor(private jwtService: JwtService) {}

//   decrypt(token: string): Promise<Record<string, unknown>> {
//     return this.jwtService.verifyAsync(token)
//   }

//   encrypt(payload: Record<string, unknown>): Promise<string> {
//     return this.jwtService.signAsync(payload)
//   }
// }
