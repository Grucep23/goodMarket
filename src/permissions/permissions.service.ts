import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name) 
    private permissionModel: SoftDeleteModel<PermissionDocument>) { } 

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const{name, apiPath, method, module} = createPermissionDto;
    console.log(apiPath,method)

    const isExist = await this.permissionModel.findOne({apiPath, method});
    if(isExist){
      throw new BadRequestException(`permission with apiPath=${apiPath}, method=${method} already exists`)
    }

    const newPermission = await this.permissionModel.create({
      name, apiPath, method, module,
      createdBy:{
        _id: user._id,
        userName: user.userName
      },
      })
      return {
        _id: newPermission?._id,
        createdAt: newPermission?.createdAt,
      }
      }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection} = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
   
    const result = await this.permissionModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    // @ts-ignore: Unreachable code error
    .sort(sort)
    .populate(population)
    .select(projection as any)
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
      throw new BadRequestException('not found permission');

      return await this.permissionModel.findById(id)
  }

  async update(_id: string, updatePermissionDto: UpdatePermissionDto, user: IUser){
    if(!mongoose.Types.ObjectId.isValid(_id)){
     throw new BadRequestException("not found permission")}

     const {module, method, apiPath, name} = updatePermissionDto;

    const updated = await this.permissionModel.updateOne(
      { _id },
      {
        module, method, apiPath, name,
        updatedBy:{
          _id: user._id,
          userName: user.userName
        }
      });
      return updated;
  }

  async remove(id: string, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(id))
    return 'not found permission';

    await this.permissionModel.updateOne(
      { _id: id },
      {
        deletedBy:{
          _id: user._id,
          userName: user.userName,
        }
      }
    )
    return this.permissionModel.softDelete({_id: id})
  }
}
