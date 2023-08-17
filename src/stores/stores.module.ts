import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './schemas/store.schema';
import { StoresService } from './stores.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }])],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
