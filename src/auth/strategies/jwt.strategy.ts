import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ConfigService} from '@nestjs/config';
import {UsersService} from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')!, // ! -> I know this value exists in my .env file
            // secretOrKey: configService.getOrThrow<string>('JWT_SECRET'), //getOrThrow() guarantees a string and throws during application startup if the environment variable is missing. Also a safe option
        });
    }

    async validate(payload: any){
        // onlyt runs if the token is valid and successfully verified
        const user = await this.usersService.findOne(payload.username);

        if (!user) {
            throw new UnauthorizedException();
        }

        if (user.accountStatus !== 'active'){
            throw new UnauthorizedException(
                `${user.username}, account ${user.accountStatus}`
            );
        }

        return {userId: payload.sub, username: payload.username};
    }
}