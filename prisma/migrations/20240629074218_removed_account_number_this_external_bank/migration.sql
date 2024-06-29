/*
  Warnings:

  - You are about to drop the column `account_id` on the `external_banks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "external_banks" DROP CONSTRAINT "external_banks_account_id_fkey";

-- DropIndex
DROP INDEX "external_banks_account_id_key";

-- AlterTable
ALTER TABLE "bank_accounts" ADD COLUMN     "externalBankId" TEXT;

-- AlterTable
ALTER TABLE "external_banks" DROP COLUMN "account_id";

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_externalBankId_fkey" FOREIGN KEY ("externalBankId") REFERENCES "external_banks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
