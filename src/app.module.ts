import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from 'nestjs-minio-client';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { ArticleCategory } from './articles/entities/article-category.entity';
import { ArticleMeta } from './articles/entities/article-meta.entity';
import { ArticleReader } from './articles/entities/article-reader.entity';
import { Article } from './articles/entities/article.entity';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { ChatMember } from './chats/entities/chat-member.entity';
import { ChatMessage } from './chats/entities/chat-message.entity';
import { ChatRoom } from './chats/entities/chat-room.entity';
import { ConfigurationsModule } from './configurations/configurations.module';
import { Configuration } from './configurations/entities/configuration.entity';
import { Invoice } from './finances/entities/invoice.entity';
import { FinancesModule } from './finances/finances.module';
import { KbCategory } from './kbs/entities/kb-category.entity';
import { Kb } from './kbs/entities/kb.entity';
import { KbsModule } from './kbs/kbs.module';
import { Media } from './media/entities/media.entity';
import { MediaModule } from './media/media.module';
import { MidtransModule } from './midtrans/midtrans.module';
import { EmailTemplate } from './notifications/entities/email-template.entity';
import { Notification } from './notifications/entities/notification.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { PublicationFile } from './publications/entities/publication-file';
import { PublicationStatus } from './publications/entities/publication-status.entity';
import { Publication } from './publications/entities/publication.entity';
import { Publisher } from './publications/entities/publisher.entity';
import { PublicationsModule } from './publications/publications.module';
import { ChapterMeta } from './stories/entities/chapter-meta.entity';
import { ChapterReader } from './stories/entities/chapter-reader.entity';
import { Chapter } from './stories/entities/chapter.entity';
import { StoryCategory } from './stories/entities/story-category.entity';
import { StoryMeta } from './stories/entities/story-meta.entity';
import { StoryReader } from './stories/entities/story-reader.entity';
import { StoryTagMap } from './stories/entities/story-tag-map.entity';
import { StoryTag } from './stories/entities/story-tag.entity';
import { StoryWriter } from './stories/entities/story-writer';
import { Story } from './stories/entities/story.entity';
import { StoriesModule } from './stories/stories.module';
import { Identity } from './users/entities/identity.entity';
import { PasswordResetToken } from './users/entities/password-reset-token.entity';
import { UserDevice } from './users/entities/user-device.entity';
import { UserFollow } from './users/entities/user-follow.entity';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { WalletTransaction } from './wallets/entities/wallet-transaction.entity';
import { Wallet } from './wallets/entities/wallet.entity';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MinioModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        endPoint: configService.get<string>('MINIO_ENDPOINT'),
        useSSL: true,
        accessKey: configService.get<string>('MINIO_ACCESSKEY'),
        secretKey: configService.get<string>('MINIO_SECRETKEY'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASS'),
        database: configService.get<string>('DATABASE_NAME'),
        synchronize: true,
        entities: [
          UserFollow,
          User,
          UserDevice,
          Identity,
          Story,
          StoryWriter,
          StoryReader,
          StoryTagMap,
          StoryTag,
          StoryMeta,
          Chapter,
          ChapterReader,
          ChapterMeta,
          StoryCategory,
          StoryTag,
          Publication,
          Publisher,
          PublicationStatus,
          PublicationFile,
          PasswordResetToken,
          Notification,
          EmailTemplate,
          Wallet,
          Article,
          ArticleMeta,
          ArticleReader,
          ArticleCategory,
          Media,
          Configuration,
          Wallet,
          WalletTransaction,
          Invoice,
          Kb,
          KbCategory,
          ChatRoom,
          ChatMember,
          ChatMessage,
        ],
      }),
    }),
    MidtransModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        isProduction: !!JSON.parse(
          configService.get<string>('MIDTRANS_IS_PRODUCTION'),
        ),
        serverKey: configService.get<string>('MIDTRANS_SERVER_KEY'),
        clientKey: configService.get<string>('MIDTRANS_CLIENT_KEY'),
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_SMTP_HOST'),
          port: configService.get<number>('MAIL_SMTP_PORT'),
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_SMTP_USER'),
            pass: configService.get<string>('MAIL_SMTP_PASS'),
          },
        },
        defaults: {
          from: configService.get<string>('MAIL_FROM'),
        },
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('BULL_REDIS_HOST'),
          port: configService.get<number>('BULL_REDIS_PORT'),
        },
      }),
    }),
    UsersModule,
    AuthModule,
    ChatsModule,
    StoriesModule,
    NotificationsModule,
    WalletsModule,
    PublicationsModule,
    MediaModule,
    ArticlesModule,
    ConfigurationsModule,
    FinancesModule,
    KbsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
