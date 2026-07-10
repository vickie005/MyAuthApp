import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// this decorator is used to extract the current authenticated user from the request object. It can be used in controller methods to access the user information after successful authentication.
export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user; // user object is attached to the request by the JwtStrategy's validate() method after successful authentication
    }
)
