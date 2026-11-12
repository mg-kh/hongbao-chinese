import { PrismaService } from '@/prisma/prisma.service';
import { successResponse } from '@/utils/response';
import { withErrorHandling } from '@/utils/withErrorHandling';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { SaveNotificationTokenDto } from './dto/save-notification-token.dto';
import { SendNotificationDto } from './dto/send-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async saveNotiToken(data: SaveNotificationTokenDto, userId: string) {
    const { token } = data;
    return this.prisma.fcmToken.upsert({
      where: {
        token,
      },
      update: {
        userId,
        updatedAt: new Date(),
      },
      create: {
        userId,
        token,
      },
    });
  }

  async sendToUser(payload: SendNotificationDto, userId: string) {
    const { title, body, data } = payload;
    return withErrorHandling(async () => {
      const fcmTokens = await this.prisma.fcmToken.findMany({
        where: { userId },
        select: { token: true },
      });

      if (fcmTokens.length === 0) {
        throw new NotFoundException('No FCM tokens found for this user');
      }

      const results = await Promise.allSettled(
        fcmTokens.map(({ token }) =>
          this.firebaseService.sendToToken(token, title, body, data),
        ),
      );

      const sent = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.length - sent;

      return successResponse({
        data: { sent, failed, total: results.length },
      });
    });
  }
}
