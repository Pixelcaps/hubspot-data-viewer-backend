import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { HubspotService } from '../hubspot.service';

@Injectable()
export class HubspotOauthInstall implements NestMiddleware {
  constructor(private hubspotService: HubspotService) {}

  use(req: Request, res: Response) {
    console.log('Request...');
    console.log('Creating authorization Url');
    const authorizationUrl =
      this.hubspotService.hubspotClient.oauth.getAuthorizationUrl(
        process.env.CLIENT_ID,
        process.env.REDIRECT_URI,
        process.env.SCOPES,
      );
    console.log('Authorization Url', authorizationUrl);

    res.redirect(authorizationUrl);
  }
}
