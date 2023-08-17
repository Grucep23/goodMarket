import {  IsNotEmpty } from 'class-validator';



export class CreateStoreDto {
    
  @IsNotEmpty()
  name: string;
  phoneNumber: string;;
  description: string;
  address: string;
 
}
  