-- CreateTable
CREATE TABLE "cafes" (
    "cate_id" BIGSERIAL NOT NULL,
    "business_name" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT NOT NULL,
    "created_at" BIGINT NOT NULL,
    "updated_at" BIGINT,

    CONSTRAINT "cafes_pkey" PRIMARY KEY ("cate_id")
);

-- CreateTable
CREATE TABLE "cafe_images" (
    "image_id" BIGSERIAL NOT NULL,
    "cafe_id" BIGINT NOT NULL,
    "image_src" TEXT NOT NULL,
    "origin_name" TEXT NOT NULL,
    "identified_name" TEXT NOT NULL,
    "extension" VARCHAR(10) NOT NULL,

    CONSTRAINT "cafe_images_pkey" PRIMARY KEY ("image_id")
);

-- CreateTable
CREATE TABLE "prices" (
    "price_id" BIGSERIAL NOT NULL,
    "cafe_id" BIGINT NOT NULL,
    "amount_subtotal" DECIMAL(18,2) NOT NULL,
    "amount_tax" DECIMAL(18,2) NOT NULL,
    "amount_total" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("price_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cafes_business_name_key" ON "cafes"("business_name");

-- CreateIndex
CREATE UNIQUE INDEX "cafe_images_identified_name_key" ON "cafe_images"("identified_name");
