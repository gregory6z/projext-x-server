/*
  Warnings:

  - You are about to drop the column `birthDate` on the `users` table. All the data in the column will be lost.
  - Added the required column `birth_date` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "birthDate",
ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL;
