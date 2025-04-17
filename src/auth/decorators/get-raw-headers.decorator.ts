import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../interfaces';

export const getRawHeaders = (
  data: string,
  ctx: ExecutionContext,
): string | string[] => {
  const req: AuthRequest = ctx.switchToHttp().getRequest();
  const rawHeaders = req.rawHeaders;

  if (!rawHeaders) {
    throw new Error('Raw headers not found');
  }

  if (data) return rawHeaders[data] as string;

  return rawHeaders;
};
export const RawHeaders = createParamDecorator(getRawHeaders);
