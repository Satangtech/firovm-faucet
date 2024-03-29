import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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
        RPC_URL: Joi.string().required(),
        NETWORK: Joi.string()
          .valid('regtest', 'testnet', 'mainnet')
          .default('regtest'),
        PRIVKEY: Joi.string().required(),
        CACHE_TIMES_MINUTE: Joi.number().default(15),
        REACH_LIMIT_HOUR: Joi.number().default(24),
        FAUCET_AMOUNT: Joi.number().default(100),
        AIS_CLIENT_ID: Joi.string().required(),
        AIS_CLIENT_SECRET: Joi.string().required(),
        AIS_GRANT_TYPE: Joi.string().required(),
        AIS_AUTH_ENDPOINT: Joi.string().required(),
        AIS_MASQUE_ENDPOINT: Joi.string().required(),
        ADMIN_USERNAME: Joi.string().required(),
        ADMIN_PASSWORD: Joi.string().required(),
      }),
    }),
    RequestsModule,
  ],
})
export class AppModule {}
