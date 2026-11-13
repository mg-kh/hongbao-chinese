import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { minutes, seconds, ThrottlerModule } from '@nestjs/throttler';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { ClerkModule } from './clerk/clerk.module';
import { ClientCourseModule } from './client/client-course/client-course.module';
import { CourseModule } from './course/course.module';
import { FeedbackModule } from './feedback/feedback.module';
import { FirebaseModule } from './firebase/firebase.module';
import { LessonModule } from './lesson/lesson.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaModule } from './prisma/prisma.module';
import { PurchasesModule } from './purchases/purchases.module';
import { QuestionModule } from './question/question.module';
import { QuizSectionModule } from './quiz-section/quiz-section.module';
import { QuizModule } from './quiz/quiz.module';
import { R2Module } from './r2/r2.module';
import { SubLessonModule } from './sub_lesson/sub_lesson.module';
import { CustomThrottlerGuard } from './throttler/custom-throttler.guard';
import { VideoModule } from './video/video.module';
import { ClientVideoModule } from './client/video/video.module';
import { ClientQuizModule } from './client/quiz/quiz.module';
import { CouponModule } from './coupon/coupon.module';
import { ClientCouponModule } from './client/client-coupon/client-coupon.module';
import { CategoryModule } from './category/category.module';
import { FlashcardModule } from './flashcard/flashcard.module';
import { ClientFlashcardModule } from './client/client-flashcard/client-flashcard.module';
import { ClientCategoryModule } from './client/client-category/client-category.module';
import { MockTestsModule } from './mock-tests/mock-tests.module';
import { ClientMockTestModule } from './client/client-mock-test/client-mock-test.module';
import { ShopModule } from './client/shop/shop.module';
import { ClientPurchaseModule } from './client/client-purchase/client-purchase.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    // Multiple named tiers are checked on every request; a request must pass
    // ALL of them to proceed. This gives burst protection (short) as well as
    // sustained-abuse protection (medium/long) at the same time.
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: seconds(1), // 1 second window
        limit: 3, // max 3 requests per second
      },
      {
        name: 'medium',
        ttl: seconds(10), // 10 second window
        limit: 20, // max 20 requests per 10 seconds
      },
      {
        name: 'long',
        ttl: minutes(1), // 60 second window
        limit: 100, // max 100 requests per minute
      },
    ]),
    PrismaModule,
    FirebaseModule,
    AuthModule,
    ClerkModule,
    CourseModule,
    LessonModule,
    SubLessonModule,
    QuizModule,
    ClientQuizModule,
    QuestionModule,
    VideoModule,
    ClientVideoModule,
    ClientCourseModule,
    PurchasesModule,
    FeedbackModule,
    QuizSectionModule,
    R2Module,
    NotificationsModule,
    CouponModule,
    ClientCouponModule,
    CategoryModule,
    FlashcardModule,
    ClientFlashcardModule,
    ClientCategoryModule,
    MockTestsModule,
    ClientMockTestModule,
    ShopModule,
    ClientPurchaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // Registered AFTER AuthGuard: global APP_GUARDs run in provider
    // registration order, so req.user is already populated (when the
    // request is authenticated) by the time CustomThrottlerGuard reads it.
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
