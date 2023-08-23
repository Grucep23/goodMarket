import {  IsNotEmpty } from 'class-validator';



export class CreateStoreDto {
    
  @IsNotEmpty()
  storeName: string;
  @IsNotEmpty()

  @IsNotEmpty()
  phoneNumber: string;
  
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  logo: string
}
  