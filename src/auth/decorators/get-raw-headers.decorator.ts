import {
  createParamDecorator,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetRawHeaders = createParamDecorator((data: string, ctx) => {
  const req = ctx.switchToHttp().getRequest();
  const rawheaders = req.rawHeaders;

  return data ? rawheaders?.[data] : rawheaders;
});
