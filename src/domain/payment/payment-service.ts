interface PaymentMethod {
  type: string
  fields: {
    number: string
    expiration_month: string
    expiration_year: string
    cvv: string
  }
}

interface PaymentResponse {
  status: {
    status: string
    error_code: string
    status_code: string
    message: string
  }
  data: {
    id: string
    amount: number
    currency: string
    status: string
  }
}

interface PaymentMethod {
  type: string
  fields: {
    number: string
    expiration_month: string
    expiration_year: string
    cvv: string
  }
}

export interface PaymentService {
  createPayment(
    amount: number,
    currency: string,
    paymentMethod: PaymentMethod,
  ): Promise<PaymentResponse>
}
