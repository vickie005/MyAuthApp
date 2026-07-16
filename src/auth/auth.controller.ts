
import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService} from './auth.service';
import {Public} from './decorators/public.decorator';
import {LocalAuthGuard} from './guards/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
// import { Request as ExpressRequest } from 'express';
@Controller('auth')
export class AuthController{
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ){}

  //login endpoint that uses the LocalAuthGuard to authenticate the user using their username and password. If authentication is successful, it returns a JWT token.
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: Express.Request){
    return this.authService.login(req.user);
  }

  //register endpoint that allows new users to register by providing their details in the request body. It uses the UsersService to create a new user and returns the created user object.
  @Public()
  @Post('register')
  async register(@Body() body: CreateUserDto){
    const user = await this.usersService.create(body);
    return user;
  }
}