import {IsOptional, IsString} from 'class-validator';

export class CreateUserDto {
  @IsString()
  // custom validators as IsUnique does not work with class-validator
  username!: string;

  @IsString()
  password!: string;

  @IsString()
  @IsOptional()
  name?: string;
}