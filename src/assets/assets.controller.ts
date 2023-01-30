import {
  Body,
  Controller,
  Delete,
  Get,
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

@Controller('assets')
export class AssetsController {
  constructor(private assetsService: AssetsService) {}

  @Get()
  findAll(): Promise<Asset[]> {
    return this.assetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Asset> {
    return this.assetsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('basic'))
  @UseFilters(MongoExceptionFilter)
  create(@Body() createAssetDto: CreateAssetDto): Promise<Asset> {
    return this.assetsService.create(createAssetDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('basic'))
  update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.assetsService.update(id, updateAssetDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('basic'))
  remove(@Param('id') id: string): Promise<Asset> {
    return this.assetsService.remove(id);
  }
}
