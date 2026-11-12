import { User } from '@clerk/backend';
import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export interface AuthRequest extends Request {
  user: User;
}

@ApiBearerAuth('access-token')
@Controller('')
export class AuthController {
  @Get('me')
  getMe(@Req() req: AuthRequest) {
    return req.user;
  }
}
