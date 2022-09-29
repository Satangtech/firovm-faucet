import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './interfaces/asset.interface';

@Injectable()
export class AssetsService {
  constructor(
    @Inject('ASSET_MODEL') private readonly assetModel: Model<Asset>,
  ) {}

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    const createdAsset = this.assetModel.create(createAssetDto);
    return createdAsset;
  }

  async findAll(): Promise<Asset[]> {
    return this.assetModel.find().exec();
  }

  async findOne(id: string): Promise<Asset> {
    return this.assetModel.findById(id).exec();
  }

  async update(id: string, updateAssetDto: UpdateAssetDto): Promise<Asset> {
    return this.assetModel.findByIdAndUpdate(id, updateAssetDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<Asset> {
    return this.assetModel.findByIdAndRemove(id);
  }
}
