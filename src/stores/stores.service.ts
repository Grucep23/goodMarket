import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Store, StoreDocument } from './schemas/store.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';


@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name) private storeModel: SoftDeleteModel<StoreDocument>) { }

create(createStoreDto: CreateStoreDto, user: IUser) {
  return  this.storeModel.create({
  ...createStoreDto,
  createdBy: {
  _id: user._id,
  phoneNumber: user.phoneNumber
  }
  })
}

async findAll(currentPage: number, limit: number, qs: string) {
  const { filter, sort, projection, population } = aqp(qs);
  delete filter.current;
  delete filter.pageSize;
  let offset = (+currentPage - 1) * (+limit);
  let defaultLimit = +limit ? +limit : 10;
  const totalStores = (await this.storeModel.find(filter)).length;
  const totalPages = Math.ceil(totalStores / defaultLimit);
 
  const result = await this.storeModel.find(filter)
  .skip(offset)
  .limit(defaultLimit)
  // @ts-ignore: Unreachable code error
  .sort(sort)
  .populate(population)
  .exec()
  return {
    meta: {
    current: currentPage,
    pageSize: limit,
    pages: totalPages, 
    total: totalStores 
    },
    result
}}

async findOne(id: string) {
  if(!mongoose.Types.ObjectId.isValid(id))
  {
  throw new BadRequestException(`not found store with id ${id}`)
  }
  return await this.storeModel.findById(id)
}

async update(id: string, updateStoreDto: UpdateStoreDto, user: IUser) {
  return await this.storeModel.updateOne(
    { _id: id},
    {
      ...updateStoreDto,
      updatedBy:{
        _id: user._id,
        phoneNumber: user.phoneNumber
      }
    }
  )
}

async remove(id: string, user: IUser) {
await this.storeModel.updateOne(
  { _id: id},
  {
    deletedBy:{
      _id: user._id,
      phoneNumber: user.phoneNumber
    }
  })
return this.storeModel.softDelete({
  _id: id
})
}
}