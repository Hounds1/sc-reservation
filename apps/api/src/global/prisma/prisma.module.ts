import { Global, Module } from "@nestjs/common";
import { PrismaConnector } from "./prisma.connector";

@Global()
@Module({
  providers: [PrismaConnector],
  exports: [PrismaConnector],
})
export class PrismaConnectorModule {}