import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { HubspotService } from '../hubspot.service';

@Injectable()
export class HubspotOauthCallBack implements NestMiddleware {
  constructor(private hubspotService: HubspotService) {}

  async use(req: Request, res: Response) {
    const code = req.query.code as string;
    console.log('Retrieving access token by code:', code);
    const getTokensResponse =
      await this.hubspotService.hubspotClient.oauth.tokensApi.createToken(
        process.env.GRANT_TYPE_AUTHORIZATION_CODE,
        code,
        process.env.REDIRECT_URI,
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
      );
    console.log('Retrieving access token result:', getTokensResponse);

    this.hubspotService.addToRedisStore(
      'accessToken',
      getTokensResponse.accessToken,
      getTokensResponse.expiresIn,
    );

    this.hubspotService.addToRedisStore(
      'refreshToken',
      getTokensResponse.refreshToken,
      0,
    );

    this.hubspotService.hubspotClient.setAccessToken(
      getTokensResponse.accessToken,
    );

    res.redirect('http://localhost:3000');
  }
}
