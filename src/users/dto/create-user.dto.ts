import { IsNotEmpty, Length } from 'class-validator';


export class CreateUserDto {

    @IsNotEmpty({ message: 'Phone number is not empty', })
    @Length(10,10, { message: 'Phone number has 10 characters', })
    phoneNumber: string;

    @IsNotEmpty({ message: 'Password is not empty', })
    password: string;

    @IsNotEmpty({ message: 'user name is not empty', })
    name: string;

    avatar: string;
}
