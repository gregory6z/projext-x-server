/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common"
import { Public } from "../auth/public"
import { SquareService } from "../payment/square/square.service"
import { UpdateTransactionStatusUseCase } from "@/domain/use-cases/update-transaction-status"
import { UpdateStatusInvestmentPurchaseUseCase } from "@/domain/use-cases/update-investment-purchase-status"

@Controller("webhooks")
export class WebhookController {
  constructor(
    private readonly squareService: SquareService,
    private readonly updateTransactionStatusUseCase: UpdateTransactionStatusUseCase,
    private readonly updateStatusInvestmentPurchaseUseCase: UpdateStatusInvestmentPurchaseUseCase,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() payload: any): Promise<void> {
    const eventHandlers: { [key: string]: (payload: any) => Promise<void> } = {
      // "order.created": async (payload: any) => {
      //   const orderId = payload.data.object.order_created.order_id

      //   const referenceId =
      //     (await this.squareService.retrieveOrder(orderId)) ?? null
      //   console.log(referenceId)
      // },
      "payment.updated": async (payload: any) => {
        const orderId = payload.data.object.payment.order_id

        const referenceId =
          (await this.squareService.retrieveOrder(orderId)) ?? null

        if (payload.data.object.payment.status === "COMPLETED" && referenceId) {
          await this.updateTransactionStatusUseCase.execute({
            transactionId: referenceId,
            status: "completed",
          })
          await this.updateStatusInvestmentPurchaseUseCase.execute({
            investmentPurchaseId: referenceId,
            status: "completed",
          })
        }
      },
    }

    if (eventHandlers[payload.type]) {
      await eventHandlers[payload.type](payload)
    } else {
      console.log("Unhandled event type:", payload.type)
    }
  }
}
