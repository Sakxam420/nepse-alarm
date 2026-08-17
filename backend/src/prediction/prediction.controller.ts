import { Controller, Get, Param, Post } from '@nestjs/common';
import { PredictionService } from './prediction.service';

@Controller('api/v1/stocks')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Get(':symbol/prediction')
  async getPrediction(@Param('symbol') symbol: string) {
    return this.predictionService.getPrediction(symbol);
  }

  @Post(':symbol/train')
  async trainModel(@Param('symbol') symbol: string) {
    return this.predictionService.triggerModelTraining(symbol);
  }
}
