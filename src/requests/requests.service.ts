import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { AisService } from '../ais/ais.service';

import { Asset } from '../assets/interfaces/asset.interface';
import { FiroRpcService } from '../firo-rpc/firo-rpc.service';
import { RequestDto } from './dto/request.dto';

@Injectable()
export class RequestsService {
  constructor(
    @Inject('ASSET_MODEL') private readonly assetModel: Model<Asset>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
    private readonly firoRpcService: FiroRpcService,
    private readonly aisService: AisService,
  ) {}

  async requestAsset(requestDto: RequestDto, ip: string): Promise<string> {
    let { address } = requestDto;
    const { asset } = requestDto;
    if (address.length !== 34) {
      const masqueData = await this.aisService.getAddressFromMasqueId(address);
      address = masqueData.data.accountAddress;
    }

    const cacheIpAsset = await this.cacheManager.get(ip);
    if (cacheIpAsset && cacheIpAsset === asset) {
      throw new HttpException(
        {
          id: 'REACH_LIMIT_IP',
          reason: 'the IP reach limit',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const cacheAddressAsset = await this.cacheManager.get(address);
    if (cacheAddressAsset && cacheAddressAsset === asset) {
      throw new HttpException(
        {
          id: 'REACH_LIMIT_ADDRESS',
          reason: 'the address reach limit',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const assetObj = await this.assetModel
      .findOne({ $or: [{ name: asset }, { symbol: asset }] })
      .exec();
    if (!assetObj) {
      throw new HttpException('Asset not found', HttpStatus.BAD_REQUEST);
    }

    let tx = '';
    if (assetObj.address === '') {
      tx = await this.firoRpcService.nativeTransfer(address, assetObj.decimal);
    } else {
      tx = await this.firoRpcService.tokenTransfer(
        assetObj.address,
        address,
        assetObj.decimal,
      );
    }

    await this.cacheManager.set(
      ip,
      asset,
      60 * 60 * this.configService.get<number>('REACH_LIMIT_HOUR'),
    );
    await this.cacheManager.set(
      address,
      asset,
      60 * 60 * this.configService.get<number>('REACH_LIMIT_HOUR'),
    );
    return tx;
  }
}
