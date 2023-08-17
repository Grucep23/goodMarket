import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassword(createUserDto.password);

    let user = await this.userModel.create({
      phoneNumber: createUserDto.phoneNumber,
      password: hashPassword,
      name: createUserDto.name,
    })
    return user;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
   
    const result = await this.userModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    .select("-password")
    .sort(sort as any)
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
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`;

    return await this.userModel.findOne({
      _id: id
    })
  }

  // in order to login by phone number
  async findOneByUsername(username: string) {
    return await this.userModel.findOne(
      {phoneNumber: username})
    }

  //check password for login
  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto })
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`;
    return this.userModel.softDelete({
      _id: id
    })
  }
}