import { Body, Controller, Post } from '@nestjs/common';
import { RequestDto } from './dto/request.dto';
import { ParseAddressPipe } from './pipe/parse-address.pipe';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private requestService: RequestsService) {}

  @Post()
  async requestAsset(@Body(new ParseAddressPipe()) body: RequestDto) {
    console.log('requestAsset', body);
    return 'requestAsset';
  }
}
