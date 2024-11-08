import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AddressesModule } from './addresses/addresses.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ConfigModule.forRoot(), AddressesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
