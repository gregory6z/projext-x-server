-- DropIndex
DROP INDEX "investment_purchases_account_id_key";

-- DropIndex
DROP INDEX "investment_purchases_investment_id_key";

-- AlterTable
ALTER TABLE "investments" ADD COLUMN     "investmentPurchaseId" TEXT;
