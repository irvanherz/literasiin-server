import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: '1234',
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [],
  exports: [JwtModule],
})
export class SharedJwtModule {}
