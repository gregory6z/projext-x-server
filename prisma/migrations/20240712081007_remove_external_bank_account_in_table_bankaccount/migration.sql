/*
  Warnings:

  - You are about to drop the column `externalBankId` on the `bank_accounts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bank_accounts" DROP CONSTRAINT "bank_accounts_externalBankId_fkey";

-- AlterTable
ALTER TABLE "bank_accounts" DROP COLUMN "externalBankId";
