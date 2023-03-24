import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Client } from '@hubspot/api-client';
import { Cache } from 'cache-manager';
import { SearchObjectDto } from './dto/search-object.dto';

@Injectable()
export class HubspotService {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  hubspotClient = new Client();

  async addToRedisStore(key: string, payload: any, ttl: number) {
    return await this.cacheService.set(key, payload, { ttl });
  }

  async getFromRedisStore(key: string) {
    return await this.cacheService.get(key);
  }

  async checkIfRefreshTokenStored() {
    const refreshToken = await this.getFromRedisStore('refreshToken');
    if (refreshToken) {
      return true;
    }
    return false;
  }

  async checkIfTokenExpired() {
    const accessToken = await this.getFromRedisStore('accessToken');
    if (!accessToken) {
      console.log('Refreshing tokens');
      await this.refreshToken();
    }
  }

  async refreshToken() {
    const refreshToken = (await this.getFromRedisStore(
      'refreshToken',
    )) as string;

    const response = await this.hubspotClient.oauth.tokensApi.createToken(
      process.env.GRANT_TYPE_REFRESH_TOKEN,
      undefined,
      undefined,
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      refreshToken,
    );

    console.log('Retrieving access token result:', response);

    this.addToRedisStore(
      'accessToken',
      response.accessToken,
      response.expiresIn,
    );

    this.addToRedisStore('refreshToken', response.refreshToken, 0);

    this.hubspotClient.setAccessToken(response.accessToken);
  }

  async getObjects(
    object: string,
    limit?: number,
    after?: string,
    properties?: string,
  ) {
    return await this.hubspotClient.crm[object].basicApi.getPage(
      limit,
      after,
      properties?.split(','),
    );
  }

  async searchObjects(object: string, searchObjectDto: SearchObjectDto) {
    return await this.hubspotClient.crm[object].searchApi.doSearch(
      searchObjectDto,
    );
  }
}
