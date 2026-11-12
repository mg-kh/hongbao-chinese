import { type ClerkClient, type WebhookEvent } from '@clerk/backend';
import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
} from '@nestjs/common';
import { type Request } from 'express';
import { Webhook } from 'svix';
import { Public } from '../auth/auth-public.decorator';
import { AuthService } from '../auth/auth.service';

@Controller('api/clerk-webhook')
export class ClerkController {
  constructor(
    private readonly authService: AuthService,
    @Inject('ClerkClient')
    private readonly clerkClient: ClerkClient,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: Request,
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
  ) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error('Missing CLERK_WEBHOOK_SECRET');
    }

    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new BadRequestException('Missing svix headers');
    }

    const payload = req.body as Buffer;
    const body = payload.toString();

    const wh = new Webhook(WEBHOOK_SECRET);

    let event: WebhookEvent;

    try {
      event = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as WebhookEvent;
    } catch (e) {
      throw new BadRequestException(e);
    }
    const { data, type } = event;
    switch (type) {
      case 'user.created': {
        const name = `${data?.first_name} ${data?.last_name}`;
        const email = data?.email_addresses?.[0]?.email_address;
        const clerkId = data?.id;
        const imageUrl = data?.image_url;
        const user = await this.authService.validateUser({
          clerkId,
          email,
          name,
          imageUrl,
        });
        await this.clerkClient.users.updateUserMetadata(clerkId, {
          publicMetadata: {
            role: user.role,
          },
        });
        break;
      }
    }

    return { success: true };
  }
}
