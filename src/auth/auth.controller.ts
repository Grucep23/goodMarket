import { Controller, Post, Req, UseGuards, Body, Res, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { Response, Request } from 'express';
import { RolesService } from 'src/roles/roles.service';
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { ApiBody, ApiTags }  from '@nestjs/swagger';


@ApiTags('auth')
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private rolesService: RolesService,

    ) {}

  @Public()
  @ResponseMessage("Register a new user")
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto){
    return this.authService.register(registerUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: UserLoginDto })
  @Post('/login')
  @ResponseMessage('user login')
  handleLogin(
  @Req() req, 
  @Res({ passthrough: true }) response: Response){
    return this.authService.login(req.user, response);
  }
  
  @Public()
  @ResponseMessage("get user information")
  @Get('/account')
  async handleGetAccount(@User() user: IUser){
    const temp = await this.rolesService.findOne(user.role) as any;
    user.permissions = temp.permissions;
    return { user };
  };

  @Public()
  @ResponseMessage("get user by refresh token")
  @Get('/refresh')
  handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response){
    const refreshToken = request.cookies["refresh_token"]
    return this.authService.processNewToken(refreshToken, response)
  };

  @Public()
  @ResponseMessage("logout user")
  @Post('/logout')
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @Param()@User() user: IUser
    ){
      console.log(user)
      return this.authService.logout(response, user)
  };
}
