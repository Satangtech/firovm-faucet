import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';
import { Cache } from 'cache-manager';
import { TokenAuthResponse } from './interfaces/token-auth-res.interface';
import { MasqueIdResponse } from './interfaces/masque-id-res.interface';

@Injectable()
export class AisService {
  private clientId: string;
  private clientSecret: string;
  private grantType: string;
  private authEndpoint: string;
  private masqueEndpoint: string;
  private logger: Logger;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.clientId = this.configService.get<string>('AIS_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('AIS_CLIENT_SECRET');
    this.grantType = this.configService.get<string>('AIS_GRANT_TYPE');
    this.authEndpoint = this.configService.get<string>('AIS_AUTH_ENDPOINT');
    this.masqueEndpoint = this.configService.get<string>('AIS_MASQUE_ENDPOINT');
    this.logger = new Logger(AisService.name);
  }

  async getAisAuthToken(): Promise<TokenAuthResponse> {
    const res = await this.httpService
      .axiosRef({
        baseURL: this.authEndpoint,
        url: '/auth/v3.2/oauth/token',
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: this.grantType,
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      })
      .catch((error) => {
        this.logger.error(error.response.data);
        throw error;
      });
    return res.data;
  }

  async getAddressFromMasqueId(masqueId: string): Promise<MasqueIdResponse> {
    const masqueData = await this.cacheManager.get(masqueId);
    if (masqueData) {
      return <MasqueIdResponse>masqueData;
    }

    let accessToken = await this.cacheManager.get('access_token');
    if (!accessToken) {
      const data = await this.getAisAuthToken();
      await this.cacheManager.set('access_token', data.access_token, 3000);
      accessToken = data.access_token;
    }

    const res = await this.httpService
      .axiosRef({
        baseURL: this.masqueEndpoint,
        method: 'get',
        url: `/api/v3/masque-be/masqueId/${masqueId}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-tid': `FaucetService-${new Date()
            .toISOString()
            .replace(/[-:T]/g, '')
            .slice(0, 14)}${Math.random().toString(36).substring(2, 7)}`,
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      })
      .catch((error) => {
        this.logger.error(error.response.data);
        throw error;
      });

    await this.cacheManager.set(masqueId, res.data, 3600);
    return res.data;
  }
}
