import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthRequest } from '../interfaces';
import { User } from '../entities/user.entity';

export const getUser = (
  data: keyof User | undefined,
  ctx: ExecutionContext,
): User | User[keyof User] => {
  const req: AuthRequest = ctx.switchToHttp().getRequest();
  const user = req.user;
  if (!user) throw new InternalServerErrorException('User not found (request)');

  return data ? user[data] : user;
};

export const GetUser = createParamDecorator(getUser);
