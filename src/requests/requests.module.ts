import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AisModule } from '../ais/ais.module';

import { AssetsModule } from '../assets/assets.module';
import { assetsProviders } from '../assets/assets.providers';
import { DatabaseModule } from '../database/database.module';
import { FiroRpcModule } from '../firo-rpc/firo-rpc.module';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

@Module({
  imports: [
    ConfigModule,
    FiroRpcModule,
    CacheModule.register(),
    AssetsModule,
    DatabaseModule,
    AisModule,
  ],
  controllers: [RequestsController],
  providers: [RequestsService, ...assetsProviders],
})
export class RequestsModule {}
