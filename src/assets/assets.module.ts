import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from '../database/database.module';
import { FiroRpcModule } from '../firo-rpc/firo-rpc.module';
import { AssetsController } from './assets.controller';
import { assetsProviders } from './assets.providers';
import { AssetsService } from './assets.service';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    FiroRpcModule,
    CacheModule.register(),
  ],
  controllers: [AssetsController],
  providers: [AssetsService, ...assetsProviders],
})
export class AssetsModule {}
