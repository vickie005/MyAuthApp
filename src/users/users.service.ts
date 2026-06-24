import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs'; // used to hash passwords before storing them in the database

@Injectable()
export class UsersService { // creates a service called 'UsersService' that contains the business logic
                            //flow: Controller -> UsersService -> Repository -> Database
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, // nestjs automatically gives the repo for the 'User' entity
  ) {}


  // method for creating a new user
  async create(dto: CreateUserDto): Promise<User> {  // this method receives user data, creates a user, hashes the password, saves it, returns the user
                                                     // it contains asynchronous operations
                                                     // Promise<user> means that this function will eventually return a User 
    const {username, password, name} = dto; // object destructuring to extract the username, password, and name from the dto object

    const salt = await bcrypt.genSalt();    // generates a salt for hashing the password. A salt is a random data added before hashing to make the hash unique even for identical passwords. This helps protect against rainbow table attacks(weakness - identical passwords producing identical hashes)
    const hashedPassword = await bcrypt.hash(password, salt);
    // create User object using the repository's create method, which prepares a new user entity but does not save it to the database yet
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      name,
    });

    /**
     *save User object to the database using the repository's save method, which persists the user entity to the database
     * this actually performs the SQL query to insert the new user into the users table in the database
     * equivalent SQL:
     *    INSERT INTO users
     *    (username, password, name)
     *    VALUES
     *    ('Vic', 'hashedPassword', 'Victory');
     */
    const newUser = await this.userRepository.save(user); // save the user to the database and return the saved user object, which now includes the generated id

    delete newUser.password; // remove password from the returned user object (do not send the password back to the client - ofc, for security reasons)
    return newUser;

  }
}

/**
 * COMPLETE FLOW:
 * 
 * Client sends request
 * 
 * POST /users
 * 
 * {
 *  "username": "Vic",
 *  "password": "1234",
 *  "name": "Victory"
 * }
 *         ↓
 *    Controller
 *         ↓
 *    UsersService.create()
 *         ↓
 *      extract data
 *         ↓
 *      generate salt
 *         ↓
 *      hash password
 *         ↓
 *    create user object
 *         ↓
 *    save user to database
 *          ↓  
 *    remove password
 *         ↓
 *    return safe user object
 */
