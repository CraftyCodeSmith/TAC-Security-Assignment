import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/coins/markets')
  getCoins(
    @Query('page') page: number,
    @Query('per_page') perPage: number,
  ): any {
    return this.appService.getCoins(page, perPage);
  }
  @Get('/coins/:id')
  getCoinDetails(@Param('id') id: string): any {
    return this.appService.getCoinDetails(id);
  }
}
