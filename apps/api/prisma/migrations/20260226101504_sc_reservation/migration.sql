-- CreateTable
CREATE TABLE "badges" (
    "badge_id" BIGSERIAL NOT NULL,
    "cafe_id" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "bg_color" TEXT NOT NULL,
    "txt_color" TEXT NOT NULL,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("badge_id")
);

-- AddForeignKey
ALTER TABLE "badges" ADD CONSTRAINT "badges_cafe_id_fkey" FOREIGN KEY ("cafe_id") REFERENCES "cafes"("cafe_id") ON DELETE RESTRICT ON UPDATE CASCADE;
