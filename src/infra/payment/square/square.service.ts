import { Injectable, Logger } from "@nestjs/common"
import { Client } from "square"

@Injectable()
export class SquareService {
  private readonly logger = new Logger(SquareService.name)

  constructor(private readonly client: Client) {}

  async retrieveOrder(orderId: string) {
    try {
      const response = await this.client.ordersApi.retrieveOrder(orderId)

      console.log(response.result)

      if (response.result.order) {
        const referencialId = response.result.order.referenceId
        return referencialId
      } else {
        return null
      }
    } catch (error) {
      this.logger.error(`Error retrieving order: ${error}`)
      throw error
    }
  }
}
