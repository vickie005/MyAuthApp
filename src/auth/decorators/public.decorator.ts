import {SetMetadata} from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic'; // key for the metadata
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true); // makes a route (method or class) public by setting the metadata key 'isPublic' to true. This decorator can be applied to controller methods or classes to indicate that they do not require authentication.