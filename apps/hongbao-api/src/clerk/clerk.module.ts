import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ClerkController } from './clerk.controller';
import { ClerkClientProvider } from './clerk.provider';
import { ClerkStrategy } from './clerk.strategy';

@Module({
  imports: [AuthModule],
  providers: [ClerkClientProvider, ClerkStrategy],
  exports: [ClerkClientProvider],
  controllers: [ClerkController],
})
export class ClerkModule {}
