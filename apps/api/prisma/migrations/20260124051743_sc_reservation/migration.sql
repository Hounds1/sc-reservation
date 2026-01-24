-- CreateTable
CREATE TABLE "accounts" (
    "account_id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "display_name" VARCHAR(30) NOT NULL,
    "role" VARCHAR(15) NOT NULL,
    "status" VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
    "created_at" BIGINT NOT NULL,
    "updated_at" BIGINT,
    "last_login_at" BIGINT,
    "email_verified_at" BIGINT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("account_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");
