import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { rentalRequestService } from "./rentalRequest.service";
import { rentalRequestController } from "./rentalRequest.controller";
import { Item } from "src/entities/items.entity";

@Module({
 imports: [TypeOrmModule.forFeature([Item])],
  providers: [rentalRequestService],
  controllers: [rentalRequestController],
})
export class rentalRequestModule{}