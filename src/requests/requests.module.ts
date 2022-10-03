import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

@Module({
  imports: [ConfigModule],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
