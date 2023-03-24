import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GetObjectQuerryDto } from './dto/get-object-querry.dto';
import { SearchObjectDto } from './dto/search-object.dto';
import { HubspotService } from './hubspot.service';

@Controller('hubspot')
export class HubspotController {
  constructor(private readonly hubspotService: HubspotService) {}

  @Get('/auth-status')
  checkAuthStatus() {
    return this.hubspotService.checkIfRefreshTokenStored();
  }

  @Get('/:object')
  getObjects(
    @Param('object') object: string,
    @Query() query: GetObjectQuerryDto,
  ) {
    return this.hubspotService.getObjects(
      object,
      +query.limit,
      query.after,
      query.properties,
    );
  }

  @Post('/search/:object')
  searchObjects(
    @Param('object') object: string,
    @Body() searchObjectDto: SearchObjectDto,
  ) {
    return this.hubspotService.searchObjects(object, searchObjectDto);
  }
}
