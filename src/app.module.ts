import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from 'nestjs-minio-client';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { ArticleCategory } from './articles/entities/article-category.entity';
import { ArticleComment } from './articles/entities/article-comment.entity';
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
import { OrderItem } from './finances/entities/order-item.entity';
import { Order } from './finances/entities/order.entity';
import { Payment } from './finances/entities/payment.entity';
import { FinancesModule } from './finances/finances.module';
import { UserMessage } from './general/entities/user-message.entity';
import { GeneralModule } from './general/general.module';
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
import { PublicationsModule } from './publications/publications.module';
import { ReportsModule } from './reports/reports.module';
import { Shipment } from './shipments/entities/shipment.entity';
import { ShipmentsModule } from './shipments/shipments.module';
import { ChapterMeta } from './stories/entities/chapter-meta.entity';
import { ChapterReader } from './stories/entities/chapter-reader.entity';
import { Chapter } from './stories/entities/chapter.entity';
import { StoryCategory } from './stories/entities/story-category.entity';
import { StoryComment } from './stories/entities/story-comment.entity';
import { StoryMeta } from './stories/entities/story-meta.entity';
import { StoryReader } from './stories/entities/story-reader.entity';
import { StoryTagMap } from './stories/entities/story-tag-map.entity';
import { StoryTag } from './stories/entities/story-tag.entity';
import { StoryWriter } from './stories/entities/story-writer';
import { Story } from './stories/entities/story.entity';
import { StoriesModule } from './stories/stories.module';
import { StorytellingAudience } from './storytellings/entities/storytelling-audience.entity';
import { StorytellingAuthor } from './storytellings/entities/storytelling-author.entity';
import { StorytellingCategory } from './storytellings/entities/storytelling-category.entity';
import { StorytellingEpisodeAudience } from './storytellings/entities/storytelling-episode-audience.entity';
import { StorytellingEpisodeMeta } from './storytellings/entities/storytelling-episode-meta.entity';
import { StorytellingEpisode } from './storytellings/entities/storytelling-episode.entity';
import { StorytellingMeta } from './storytellings/entities/storytelling-meta.entity';
import { Storytelling } from './storytellings/entities/storytelling.entity';
import { StorytellingsModule } from './storytellings/storytellings.module';
import { Identity } from './users/entities/identity.entity';
import { PasswordResetToken } from './users/entities/password-reset-token.entity';
import { UserAddress } from './users/entities/user-address';
import { UserDevice } from './users/entities/user-device.entity';
import { UserFollow } from './users/entities/user-follow.entity';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { Waiter } from './waiters/entities/waiter.entity';
import { WaitersModule } from './waiters/waiters.module';
import { WalletTransaction } from './wallets/entities/wallet-transaction.entity';
import { Wallet } from './wallets/entities/wallet.entity';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
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
          Waiter,
          UserFollow,
          User,
          UserDevice,
          UserAddress,
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
          StoryComment,
          Publication,
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
          ArticleComment,
          Media,
          Configuration,
          Wallet,
          WalletTransaction,
          Order,
          OrderItem,
          Payment,
          Kb,
          KbCategory,
          ChatRoom,
          ChatMember,
          ChatMessage,
          Shipment,

          Storytelling,
          StorytellingAuthor,
          StorytellingAudience,
          StorytellingMeta,
          StorytellingEpisode,
          StorytellingCategory,
          StorytellingEpisodeMeta,
          StorytellingEpisodeAudience,

          UserMessage,
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
    WaitersModule,
    ShipmentsModule,
    StorytellingsModule,
    ReportsModule,
    GeneralModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
