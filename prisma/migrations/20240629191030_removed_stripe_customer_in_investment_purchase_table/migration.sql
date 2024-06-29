/*
  Warnings:

  - You are about to drop the column `stripe_customer_id` on the `investment_purchases` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_id` on the `investment_purchases` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "investment_purchases" DROP COLUMN "stripe_customer_id",
DROP COLUMN "stripe_subscription_id";
