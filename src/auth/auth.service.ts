import { Injectable } from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser({username, password}: LoginDto){
    const user = await this.usersService.findOne(username, true);
    if (!user){
      return null; // returning 'null' instead of throwing an exeption coz I want to use this method elsewhere
    }

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) {
        return null;
      }
      
    } catch (error) {
      return null;
    }

    delete user.password;

    return user;
  }

}
