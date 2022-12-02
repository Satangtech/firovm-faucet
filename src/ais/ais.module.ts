import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AisService } from './ais.service';

@Module({
  imports: [ConfigModule, HttpModule, CacheModule.register()],
  providers: [AisService],
  exports: [AisService],
})
export class AisModule {}
