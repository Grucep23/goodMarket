import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

//extended based on class CreateUserDto, omit update password field, add field _id
export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {
    _id: string;
}