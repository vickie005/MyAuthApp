import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUsersDto } from './dto/find-users.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findMany(@Query() query: FindUsersDto) {
    return this.usersService.findMany(query);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user; // returns the authenticated user, making use of the CurrentUser decorator to extract user information from the request object
  }

}
