import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { HubspotService } from '../hubspot.service';

@Injectable()
export class HubspotAccessTokenRefresh implements NestMiddleware {
  constructor(private hubspotService: HubspotService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    await this.hubspotService.checkIfTokenExpired();
    next();
  }
}
