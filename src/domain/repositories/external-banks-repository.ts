import { ExternalBank } from "../entities/external-bank"

export abstract class ExternalBanksRepository {
  abstract create(externalBank: ExternalBank): Promise<void>
  abstract delete(externalBank: ExternalBank): Promise<void>
  abstract findById(id: string): Promise<ExternalBank | null>
}
