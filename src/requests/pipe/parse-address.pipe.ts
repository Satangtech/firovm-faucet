import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Address, Networks } from 'fvmcore-lib';
import { RequestDto } from '../dto/request.dto';

@Injectable()
export class ParseAddressPipe implements PipeTransform<RequestDto> {
  transform(value: RequestDto, metadata: ArgumentMetadata): RequestDto {
    const address = value.address.replace('0x', '');
    const network = process.env.NETWORK;
    if (address.length === 40) {
      return {
        address: this.fromHexAddress(address, network),
        asset: value.asset,
      };
    }
    return value;
  }

  fromHexAddress = (hash: string, network: string) => {
    const address = Address.fromPublicKeyHash(
      Buffer.from(hash.replace('0x', ''), 'hex'),
      Networks.get(network),
    );
    return address.toString();
  };
}
