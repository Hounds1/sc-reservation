-- AddForeignKey
ALTER TABLE "cafe_images" ADD CONSTRAINT "cafe_images_cafe_id_fkey" FOREIGN KEY ("cafe_id") REFERENCES "cafes"("cafe_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_cafe_id_fkey" FOREIGN KEY ("cafe_id") REFERENCES "cafes"("cafe_id") ON DELETE RESTRICT ON UPDATE CASCADE;
