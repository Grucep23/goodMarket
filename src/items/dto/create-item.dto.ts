import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';
import { Transform, Type } from 'class-transformer';

class Store{
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;
  storeName: string;
  logo: string;
}

export class CreateItemDto {
    
  @IsNotEmpty()
  name: string;
  price: number;
  description: string;
  location: string;

  @IsArray()
  @IsString({each: true})
  @IsNotEmpty()
  classify: string[];

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Store)
  store: Store;

  @IsBoolean()
    isActive: boolean;
  
    @IsNotEmpty()
    @Transform(({value}) => new Date(value))
    @IsDate()
    startDate: Date
    endDate: Date

   
}