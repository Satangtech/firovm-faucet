import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';
import { TokenAuthResponse } from './interfaces/token-auth-res.interface';

@Injectable()
export class AisService {
  private clientId: string;
  private clientSecret: string;
  private grantType: string;
  private endpoint: string;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.clientId = this.configService.get<string>('AIS_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('AIS_CLIENT_SECRET');
    this.grantType = this.configService.get<string>('AIS_GRANT_TYPE');
    this.endpoint = this.configService.get<string>('AIS_ENDPOINT');
  }

  async getAisAuthToken(): Promise<TokenAuthResponse> {
    const res = await this.httpService.axiosRef({
      baseURL: this.endpoint,
      url: '/auth/v3.2/oauth/token',
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: this.grantType,
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });
    return res.data;
  }
}
