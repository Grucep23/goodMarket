import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(password, user.password);
            if (isValid === true) {
                return user;
            }
        }

        return null;
    }

    async login(user: IUser) {
        const { _id, phoneNumber, name, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            phoneNumber,
            role
        };
            return {
                access_token: this.jwtService.sign(payload),
                _id,
                name,
                phoneNumber,
                role
                };
        };

}
