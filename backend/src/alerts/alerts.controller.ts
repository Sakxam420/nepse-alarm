import { Controller, Get, Post, Delete, Patch, Body, Param, HttpCode } from '@nestjs/common';
import { AlertsService, CreateAlertDto } from './alerts.service';

@Controller('api/v1/alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async getAllAlerts() {
    return this.alertsService.getAllAlerts();
  }

  @Post()
  async createAlert(@Body() dto: CreateAlertDto) {
    return this.alertsService.createAlert(dto);
  }

  @Delete(':id')
  async deleteAlert(@Param('id') id: string) {
    return this.alertsService.deleteAlert(id);
  }

  @Patch(':id/toggle')
  async toggleAlert(@Param('id') id: string) {
    return this.alertsService.toggleAlert(id);
  }

  @Post('evaluate')
  @HttpCode(200)
  async evaluateAlerts() {
    const triggered = await this.alertsService.evaluateActiveAlerts();
    return {
      evaluatedAt: new Date().toISOString(),
      triggeredCount: triggered.length,
      triggered,
    };
  }
}
