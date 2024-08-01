// // payment.controller.ts
// import { Controller, Post, Req, Res, Headers, HttpCode } from "@nestjs/common"

// import Stripe from "stripe"

// import { Request, Response } from "express"

// import { UpdateTransactionStatusUseCase } from "@/domain/use-cases/update-transaction-status"

// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error(
//     "STRIPE_SECRET_KEY is not defined in the environment variables",
//   )
// }

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2024-06-20",
// })

// @Controller("/payment")
// export class PaymentController {
//   constructor(
//     private updateTransactionStatusUseCase: UpdateTransactionStatusUseCase,
//   ) {}

//   @Post("webhook")
//   @HttpCode(200)
//   async handleWebhook(
//     @Req() req: Request,
//     @Res() res: Response,
//     @Headers("stripe-signature")
//     signature: string,
//   ) {
//     const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
//     let event

//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body,
//         signature,
//         endpointSecret || "",
//       )
//     } catch (err) {
//       console.log(`Webhook signature verification failed.`)
//       return res.sendStatus(400)
//     }

//     switch (event.type) {
//       case "checkout.session.completed":
//         // eslint-disable-next-line no-case-declarations
//         const session = event.data.object as Stripe.Checkout.Session
//         console.log("Checkout Session was successful!", session)

//         await this.updateTransactionStatusUseCase.execute({
//           transactionId: session.client_reference_id as string,
//           status: "completed",
//         })

//         break

//       case "payment_intent.payment_failed":
//         // eslint-disable-next-line no-case-declarations
//         const paymentFailure = event.data.object as Stripe.PaymentIntent
//         console.log("PaymentIntent failed!", paymentFailure)

//         await this.updateTransactionStatusUseCase.execute({
//           transactionId: paymentFailure.metadata.client_reference_id,
//           status: "failed",
//         })

//         break

//       default:
//         console.log(`Unhandled event type ${event.type}`)
//     }

//     res.json({ received: true })
//   }
// }
