import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssetsModule } from './assets/assets.module';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [
    AssetsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        BIND: Joi.string().default('0.0.0.0'),
        MONGO_URL: Joi.string().required(),
        MONGO_URL_TEST: Joi.string().required(),
        RPC_URL: Joi.string().required(),
        NETWORK: Joi.string()
          .valid('regtest', 'testnet', 'mainnet')
          .default('regtest'),
        PRIVKEY: Joi.string().required(),
        CACHE_TIMES_MINUTE: Joi.number().default(15),
        REACH_LIMIT_HOUR: Joi.number().default(24),
      }),
    }),
    RequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
