import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RolesService } from 'src/roles/roles.service';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private rolesService: RolesService,
        
        ) {}
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if(user){
            const isValid = this.usersService.isValidPassword(pass, user.password)
            if(isValid===true){
                const userRole = user.role as any;
                const temp = await this.rolesService.findOne(userRole);

                const objUser = {
                    ...user.toObject(),
                    permissions: temp?.permissions ?? []
                }
                return objUser;
            }
        }
        return null;
      }
      async login(user: IUser, response: Response) {
        const { _id, userName, email, phoneNumber, role, permissions} = user;
        const payload = {
        sub: "token login",
        iss: "from server",
        _id,
        userName,
        email,
        phoneNumber,
        role,
        permissions,
        };

        const refresh_token = this.createRefreshToken(payload)
        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id)
        //set refresh_token as cookie
        response.cookie('refresh_token', refresh_token,{
            httpOnly: true,
            maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")),
        })
        return {
        access_token: this.jwtService.sign(payload),
        user:{
            _id,
            userName,
            email,
            phoneNumber,
            role,
            permissions
        }  
}
}

async register(registerUserDto: RegisterUserDto) {
    let newUser = await this.usersService.register(registerUserDto);
    return {
        _id: newUser?._id,
        createdAt: newUser?.createdAt,
    }
}

createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
        expiresIn: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))/1000
    });
    return refresh_token;
}
processNewToken = async (refreshToken: string, response: Response) => {
    try {
        this.jwtService.verify(refreshToken,{
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
        })
        let user  = await this.usersService.findUserByToken(refreshToken);
        if(user){
        const { _id, userName, phoneNumber, email, role } = user;
        const payload = {
        sub: "token refresh",
        iss: "from server",
        _id,
        userName,
        phoneNumber,
        email,
        role
        };

        const refresh_token = this.createRefreshToken(payload)
        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token,_id.toString())
        //fetch user's role
        const userRole = role as any;
        const temp = await this.rolesService.findOne(userRole)
        //set refresh_token as cookie
        response.clearCookie("refresh_token")

        response.cookie('refresh_token', refresh_token,{
            httpOnly: true,
            maxAge:ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")),
        })
        
        return {
        access_token: this.jwtService.sign(payload),
        user:{
            _id,
            userName,
            phoneNumber,
            email,
            role,
            permissions: temp?.permissions ?? []

        }  
}
        }
        else{
            throw new BadRequestException("refresh token is unvalid")
        }
    } catch (error) {
        throw new BadRequestException("refresh token is unvalid")
    }
};

logout = async (response: Response, user: IUser) => {
    await this.usersService.updateUserToken("",user._id)
    response.clearCookie("refresh_token")
    return "ok"
}
}
