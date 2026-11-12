import { CurrentUser } from '@/decorators/current-user.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role, type User } from '@prisma/client';
import { Roles } from '../role/role.decorator';
import { SaveNotificationTokenDto } from './dto/save-notification-token.dto';
import { SendNotificationDto } from './dto/send-notification.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('Dashboard - Notifications')
@ApiBearerAuth('access-token')
@Controller('dashboard/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send-to-user')
  @Roles(Role.ADMIN)
  sendToUser(@CurrentUser() user: User, @Body() data: SendNotificationDto) {
    return this.notificationsService.sendToUser(data, user?.id);
  }

  @Post('save-noti-token')
  saveNotiToken(
    @CurrentUser() user: User,
    @Body() data: SaveNotificationTokenDto,
  ) {
    return this.notificationsService.saveNotiToken(data, user?.id);
  }
}
