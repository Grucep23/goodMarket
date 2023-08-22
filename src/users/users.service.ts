import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import mongoose from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { IUser } from './users.interface';
import { User } from "src/decorator/customize";
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';


@Injectable()
export class UsersService {

  constructor(
    @InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto, @User() user: IUser){
    const {userName, password, email, phoneNumber, role, store, } = createUserDto;

    //check exist userName, phonNumber, email
    const isExistUserName = await this.userModel.findOne({userName})
    if(isExistUserName){
      throw new BadRequestException(`userName: ${userName} already exists`)
    }
    const isExistEmail = await this.userModel.findOne({email})
    if(isExistEmail){
      throw new BadRequestException(`email: ${email} already exists`)
    }
    const isExistPhoneNumber = await this.userModel.findOne({phoneNumber})
    if(isExistPhoneNumber){
      throw new BadRequestException(`phoneNumber: ${phoneNumber} already exists`)
    }
  
    const hashPassword = this.getHashPassword(createUserDto.password)
    let newUser = await this.userModel.create({
      userName, email, password, phoneNumber, role, store,
      createdBy: {
        _id: user._id,
        userName: user.userName,
      }
    })
    return newUser; 
  }

  async register(user: RegisterUserDto){
    const { userName, email, phoneNumber, password } = user;

    //check exist userName, phonNumber, email
    const isExistUserName = await this.userModel.findOne({userName})
    if(isExistUserName){
      throw new BadRequestException(`userName: ${userName} already exists`)
    }
    const isExistEmail = await this.userModel.findOne({email})
    if(isExistEmail){
      throw new BadRequestException(`email: ${email} already exists`)
    }
    const isExistPhoneNumber = await this.userModel.findOne({phoneNumber})
    if(isExistPhoneNumber){
      throw new BadRequestException(`phoneNumber: ${phoneNumber} already exists`)
    }
    //fetch user role
    const userRole = await this.roleModel.findOne({name: "USER_ROLE"})

    const hashPassword = this.getHashPassword(password)
    let newRegister = await this.userModel.create({
      userName, email, phoneNumber,
      password: hashPassword, 
      role: userRole?._id
    })
    return newRegister; 
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

  // in order to login by userName
  async findOneByUsername(username: string) {
    return await this.userModel.findOne(
      {userName: username})
    }

  //check password for login
  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    const updated = await this.userModel.updateOne(
      {_id: updateUserDto._id},
      {...updateUserDto,
      updateBy:{
        _id: user._id,
        userName: user.userName,
      }});
      return updated
  }

  async remove(id: string, @User() user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      return 'not found user'
     }
     const foundUser = await this.userModel.findById(id)
     if(foundUser && foundUser.userName === "admin"){
      throw new BadRequestException("cant not delete this user name")
     }
        await this.userModel.updateOne(
          {_id: id},
          {
            deletedBy:{
              _id: user._id,
              userName: user.userName,
            }
          });
        return this.userModel.softDelete({
          _id: id
        }) 
       }
  updateUserToken = async (refreshToken: string, _id: string) =>{
        return await this.userModel.updateOne(
          {_id},
          { refreshToken }
          )
        }

  findUserByToken = async (refreshToken: string) =>{
    return await this.userModel.findOne({ refreshToken })
    .populate({
      path: "role", select: {name: 1}
    })
  }
}