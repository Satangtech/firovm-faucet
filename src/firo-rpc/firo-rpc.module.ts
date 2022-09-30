import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FiroRpcService } from './firo-rpc.service';

@Module({
  imports: [ConfigModule],
  providers: [FiroRpcService],
  exports: [FiroRpcService],
})
export class FiroRpcModule {}
