import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private rolesService: RolesService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET')
    });
  }

  async validate(payload: IUser) {
    const { _id, userName, email, phoneNumber, role, permissions } = payload;
    const userRole = role as any;
    const temp = (await this.rolesService.findOne(userRole)).toObject();
    return {
      _id, userName, email, phoneNumber, role,
    permissions: temp?.permissions ?? []
    };
    }
}