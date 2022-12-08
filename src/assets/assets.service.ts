import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';

import { FiroRpcService } from '../firo-rpc/firo-rpc.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './interfaces/asset.interface';

@Injectable()
export class AssetsService {
  private logger: Logger;

  constructor(
    @Inject('ASSET_MODEL') private readonly assetModel: Model<Asset>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
    private readonly firoRpcService: FiroRpcService,
  ) {
    this.logger = new Logger(AssetsService.name);
  }

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    const createdAsset = this.assetModel.create(createAssetDto);
    await this.cacheManager.del('assets');
    return createdAsset;
  }

  async findAll(): Promise<Asset[]> {
    const cacheAssets = await this.cacheManager.get('assets');
    if (cacheAssets) {
      this.logger.log('Assets found in cache');
      return <Asset[]>cacheAssets;
    }

    const assets = await this.assetModel.find().exec();
    const assetsUpdate = await Promise.all(
      assets.map(async (asset) => {
        let balance = 0;
        if (asset.address === '') {
          balance = await this.firoRpcService.getNativeBalance();
        } else {
          balance = await this.firoRpcService.getAssetBalance(asset.address);
        }
        return await this.assetModel.findOneAndUpdate(
          { address: asset.address },
          { balance },
          { new: true },
        );
      }),
    );
    await this.cacheManager.set(
      'assets',
      assetsUpdate,
      60 * this.configService.get<number>('CACHE_TIMES_MINUTE'),
    );
    this.logger.log('Assets saved in cache');
    return assetsUpdate;
  }

  async findOne(id: string): Promise<Asset> {
    return this.assetModel.findById(id).exec();
  }

  async update(id: string, updateAssetDto: UpdateAssetDto): Promise<Asset> {
    const result = this.assetModel.findByIdAndUpdate(id, updateAssetDto, {
      new: true,
    });
    await this.cacheManager.del('assets');
    return result;
  }

  async remove(id: string): Promise<Asset> {
    const result = this.assetModel.findByIdAndRemove(id);
    await this.cacheManager.del('assets');
    return result;
  }
}
