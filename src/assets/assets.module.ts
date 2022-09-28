import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AssetsController } from './assets.controller';
import { assetsProviders } from './assets.providers';
import { AssetsService } from './assets.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AssetsController],
  providers: [AssetsService, ...assetsProviders],
})
export class AssetsModule {}
