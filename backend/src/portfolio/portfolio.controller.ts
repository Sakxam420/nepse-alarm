import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { PortfolioService, CreatePositionDto } from './portfolio.service';

@Controller('api/v1/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  async getPositions() {
    return this.portfolioService.getAllPositions();
  }

  @Post()
  async addPosition(@Body() dto: CreatePositionDto) {
    return this.portfolioService.createPosition(dto);
  }

  @Delete(':id')
  async deletePosition(@Param('id') id: string) {
    return this.portfolioService.deletePosition(id);
  }

  @Get('summary')
  async getSummary() {
    return this.portfolioService.getPortfolioSummary();
  }
}
