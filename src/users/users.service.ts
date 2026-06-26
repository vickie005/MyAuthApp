import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs'; // used to hash passwords before storing them in the database

@Injectable()
export class UsersService { // creates a service called 'UsersService' that contains the business logic
                            //flow: Controller -> UsersService -> Repository -> Database
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, // nestjs automatically gives the repo for the 'User' entity
  ) {}


  // method for creating a new user
  // async create(dto:createUserDto) :Promise<Partial<Iser>> --> This function will return an object based on User, but some properties may be missing
  async create(dto: CreateUserDto): Promise<User> {  // this method receives user data, creates a user, hashes the password, saves it, returns the user
                                                     // it contains asynchronous operations
                                                     // Promise<user> means that this function will eventually return a User 
                                                     const {username, password, name} = dto; // object destructuring to extract the username, password, and name from the dto object

    const salt = await bcrypt.genSalt();    // generates a salt for hashing the password. A salt is a random data added before hashing to make the hash unique even for identical passwords. This helps protect against rainbow table attacks(weakness - identical passwords producing identical hashes)
    const hashedPassword = await bcrypt.hash(password, salt);
    // create User object using the repository's create method, which prepares a new user entity but does not save it to the database yet
    const user = this.usersRepository.create({
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
    const newUser = await this.usersRepository.save(user); // save the user to the database and return the saved user object, which now includes the generated id
  
    const cUser: Partial<User> = {...newUser}; // create a copy of the newUser object to avoid mutating the original object
    // the spread operator(...) copies all properties from 'newUser' into a new object 'cUser', which is of type Partial<User> (changing cUser does not change newUser)
    delete cUser.password; // remove password from the returned user object (do not send the password back to the client - ofc, for security reasons)
    // delete newUser.password; // remove password from the returned user object (do not send the password back to the client - ofc, for security reasons)
    //return newUser;
    return cUser as User; // 'as user' is a type assertion.. telling ts "trust me - treat this object as a user"
    // just changed the code from trying to delete a property directly from a User entity to deleting it from a temporary copy whose type is Partial<User>.
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

  async findMany(dto:FindUsersDto){
    return this.usersRepository.createQueryBuilder('user').getMany();
  }
  async findOne(
    username: string,
    selectSecrets: boolean = false
  ):Promise<User | null> { // this method receives a username and an optional boolean parameter selectSecrets (defaulting to false) and returns a Promise that resolves to a User object or null if no user is found
    return this.usersRepository.findOne({
      where:{username},
      select:{
        id: true,
        username: true,
        name: true,
        accountStatus: true,
        password: selectSecrets, // if selectSecrets is true, include the password in the result; otherwise, exclude it
      },
    });
  }

}

