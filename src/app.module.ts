import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { Chapter } from './stories/entities/chapter.entity';
import { Story } from './stories/entities/story.entity';
import { StoriesModule } from './stories/stories.module';
import { Identity } from './users/entities/identity.entity';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
        entities: [User, Identity, Story, Chapter],
      }),
    }),
    UsersModule,
    AuthModule,
    ChatsModule,
    StoriesModule,
    NotificationsModule,
    WalletsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
