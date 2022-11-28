import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AisService } from './ais.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [AisService],
  exports: [AisService],
})
export class AisModule {}
