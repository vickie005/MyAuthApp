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

      // delete user.password; // ts throws an error "The operand of a 'delete' operator must be optional." coz the password property is not optional in the User entity. So, I will use destructuring to remove the password property from the user object before returning it.
      // return user;
    const {password: _, ...result} = user; //takes the password property from the user and renames it into the local variable '_'. Since _ is never used, the password is effectively discarded. Collects all the remaining properties into a new object called result

    return result;
  }
   async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
   }

}
