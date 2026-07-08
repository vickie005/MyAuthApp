import {Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {} //  the guarded route(login route) , when a request comes in, this LocalAuthGuard will intercept the request and forward the payload to a local strategy.