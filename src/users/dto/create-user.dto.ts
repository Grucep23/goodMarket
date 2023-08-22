import { Type } from 'class-transformer';
import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested, Length, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';


class Store {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;
    storeName: string;
  }
export class CreateUserDto {

    @IsNotEmpty({ message: 'user name is not empty', })
    userName: string;

    @IsNotEmpty({ message: 'Password is not empty', })
    password: string;

    @IsNotEmpty({ message: 'Phone number is not empty', })
    @Length(10,10, { message: 'Phone number has 10 characters', })
    phoneNumber: string;

    @IsEmail({}, { message: 'Email is incorrect format', })
    @IsNotEmpty({ message: 'Email is not empty', })
    email: string;

    @IsNotEmpty()
    @IsMongoId()
    role: mongoose.Schema.Types.ObjectId;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Store)
    store: Store;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'user name is not empty', })
  userName: string;

  @IsNotEmpty({ message: 'Password is not empty', })
  password: string;

  @IsNotEmpty({ message: 'Phone number is not empty', })
  @Length(10,10, { message: 'Phone number has 10 characters', })
  phoneNumber: string;

  @IsEmail({}, { message: 'Email is incorrect format', })
  @IsNotEmpty({ message: 'Email is not empty', })
  email: string;
}

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'user1', description: 'userName' })
  readonly username: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
  example: '123456',
  description: 'password',
  })
  readonly password: string;
}


