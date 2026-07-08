import {SetMetadata} from '@nestjs/common';

// this decorator is used to mark a route as public, meaning it does not require authentication. It sets a metadata key 'isPublic' to true, which can be checked by guards to allow access without authentication.
export const IS_PUBLIC_KEY = 'isPublic'; // key for the metadata
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true); 