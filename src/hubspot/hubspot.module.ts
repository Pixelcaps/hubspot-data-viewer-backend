import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HubspotService } from './hubspot.service';
import { HubspotController } from './hubspot.controller';
import { HubspotOauthInstall } from './middleware/hubspot-oauth-install.middleware';
import { HubspotOauthCallBack } from './middleware/hubspot-oauth-callback.middleware';
import { HubspotAccessTokenRefresh } from './middleware/hubspot-access-token-refresh.middleware';

@Module({
  controllers: [HubspotController],
  providers: [HubspotService],
})
export class HubspotModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HubspotOauthInstall).forRoutes('oauth');
    consumer.apply(HubspotOauthCallBack).forRoutes('oauth-callback');
    consumer
      .apply(HubspotAccessTokenRefresh)
      .exclude('hubspot/auth-status')
      .forRoutes('hubspot/*');
  }
}
