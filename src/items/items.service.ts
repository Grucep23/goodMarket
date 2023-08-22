import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import mongoose from 'mongoose';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Item, ItemDocument } from './schemas/item.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';


@Injectable()
export class ItemsService {

  constructor(
    @InjectModel(Item.name) 
    private itemModel: SoftDeleteModel<ItemDocument>) {} 

  async create(createItemDto: CreateItemDto, user: IUser) {
    const{
      name, classify, store, price, 
      description, startDate, endDate, isActive, location
    } = createItemDto;
    let newItem = await this.itemModel.create({
      name, classify, store, price, 
      description, startDate, endDate, isActive, location,
      createdBy:{
        _id: user._id,
        userName: user.userName,
      }
      }
    )
  }
  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.itemModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
   
    const result = await this.itemModel.find(filter)
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
      total: totalItems 
      },
      result 
  }}

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))
      return 'not found item';

      return await this.itemModel.findById(id)
  }

  async update(id: string, updateItemDto: UpdateItemDto, user: IUser){
    const updated = await this.itemModel.updateOne({
      _id: id},
      {
        ...updateItemDto,
        updatedBy:{
          _id: user._id,
          userName: user.userName,
        }
      })
      return updated;
  }

  async remove(id: string, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(id))
    return 'not found item';

    await this.itemModel.updateOne(
      {_id: id},
      {
        deletedBy:{
          _id: user._id,
          userName: user.userName,
        }
      },
    )
    return this.itemModel.softDelete({_id: id})
  }
}