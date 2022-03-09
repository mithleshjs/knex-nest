import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get('users')
  getUsers(@Body() params) {
    return this.appService.getUsers();
  }

  @Get('artists/offset')
  getArtists(@Body() params) {
    return this.appService.getArtistsByOffset(params.perPage, params.goToPage);
  }

  @Get('artists/cursor')
  getArtistsByCursor(@Body() params) {
    return this.appService.getArtistsByCursor(
      params.cursor,
      params.direction,
      params.order,
      params.perPage
    );
  }
}
