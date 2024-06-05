/*
  Warnings:

  - You are about to drop the column `secconds` on the `resultspeedrpm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `resultspeedrpm` DROP COLUMN `secconds`,
    ADD COLUMN `seconds` INTEGER NULL;
