import { Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ValidateUserDto } from './dto/validate-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByClerkId(clerkId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { clerkId },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async validateUser(params: ValidateUserDto) {
    const { clerkId, email, name, imageUrl } = params;
    const userByClerkId = await this.getUserByClerkId(clerkId);
    if (userByClerkId) return userByClerkId;
    const userByEmail = await this.getUserByEmail(email);
    if (userByEmail) return userByEmail;
    const user = await this.prisma.user.create({
      data: {
        clerkId,
        email,
        name,
        imageUrl,
        role: Role.STUDENT,
      },
    });
    return user;
  }
}
