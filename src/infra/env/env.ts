import { z } from "zod"

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3333),
  JWT_PUBLIC_KEY: z.string(),
  JWT_PRIVATE_KEY: z.string(),

  STRIPE_SECRET_KEY: z.string(),

  SQUARE_ACCESS_KEY: z.string(),

  // RESEND_KEY: z.string(),
  // URL_FRONTEND: z.string().url(),
  // NODE_ENV: z.string().optional().default("development"),
})

export type Env = z.infer<typeof envSchema>
