import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
} from '@nestjs/common';
import { RequestDto } from './dto/request.dto';
import { ParseAddressPipe } from './pipe/parse-address.pipe';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private requestService: RequestsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async requestAsset(
    @Body(new ParseAddressPipe()) requestDto: RequestDto,
    @Ip() ip: string,
  ) {
    return {
      tx: await this.requestService.requestAsset(requestDto, ip),
    };
  }
}
