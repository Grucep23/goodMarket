import {  IsNotEmpty } from 'class-validator';



export class CreateStoreDto {
    
  @IsNotEmpty()
  storeName: string;
  phoneNumber: string;;
  description: string;
  address: string;
  logo: string
}
  