import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Mixed = createParamDecorator(
  (parts: string[], ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return parts.reduce((a, c) => {
      a = { ...a, ...req[c] };
      return a;
    }, {});
  },
);
