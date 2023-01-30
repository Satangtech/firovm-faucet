import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MongoExceptionFilter } from '../database/mongo-exception.filter';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './interfaces/asset.interface';
import { ParseObjectIdPipe } from './pipe/parse-objectid.pipe';

@Controller('assets')
export class AssetsController {
  constructor(private assetsService: AssetsService) {}

  @Get()
  findAll(): Promise<Asset[]> {
    return this.assetsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string): Promise<Asset> {
    const asset = await this.assetsService.findOne(id);
    if (!asset) {
      throw new HttpException('Asset not found', HttpStatus.NOT_FOUND);
    }
    return asset;
  }

  @Post()
  @UseGuards(AuthGuard('basic'))
  @UseFilters(MongoExceptionFilter)
  create(@Body() createAssetDto: CreateAssetDto): Promise<Asset> {
    return this.assetsService.create(createAssetDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('basic'))
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateAssetDto: UpdateAssetDto,
  ) {
    const asset = await this.assetsService.findOne(id);
    if (!asset) {
      throw new HttpException('Asset not found', HttpStatus.NOT_FOUND);
    }
    return this.assetsService.update(id, updateAssetDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('basic'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseObjectIdPipe) id: string): Promise<Asset> {
    const asset = await this.assetsService.findOne(id);
    if (!asset) {
      throw new HttpException('Asset not found', HttpStatus.NOT_FOUND);
    }
    return this.assetsService.remove(id);
  }
}
