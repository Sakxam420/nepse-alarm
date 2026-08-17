import { Injectable, Logger } from '@nestjs/common';
import { StockService } from '../stock/stock.service';
import axios from 'axios';

@Injectable()
export class PredictionService {
  private readonly logger = new Logger(PredictionService.name);
  private readonly mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';

  constructor(private readonly stockService: StockService) {}

  async getPrediction(symbol: string) {
    const history = await this.stockService.getEnrichedPriceHistory(symbol.toUpperCase());
    
    if (history.length < 30) {
      return {
        symbol,
        trend: 'Neutral',
        confidence: 50.0,
        source: 'Heuristic',
        message: 'Insufficient historical data (minimum 30 trading days required for sequence embeddings).',
        indicators: { rsi: 50, macd: 0, trend: 'Consolidating' },
        features: {},
      };
    }

    try {
      this.logger.log(`Requesting ML prediction from FastAPI service for ${symbol}...`);
      
      // Call external Python FastAPI microservice
      const response = await axios.post(`${this.mlServiceUrl}/predict`, {
        symbol,
        history: history.slice(-60), // Send last 60 days to allow safe sliding windows on Python side
      });

      if (response.data) {
        return {
          symbol,
          trend: response.data.trend,
          confidence: Number(response.data.confidence.toFixed(2)),
          source: 'ML Hybrid Model',
          message: 'Prediction generated successfully using hybrid LSTM-XGBoost Architecture.',
          indicators: response.data.indicators,
          features: response.data.features || {},
        };
      }
    } catch (error) {
      this.logger.warn(`FastAPI ML service call failed: ${error.message}. Resorting to native heuristic engine.`);
      
      // Graceful Heuristic Fallback calculation
      const latest = history[history.length - 1];
      const rsi = latest.rsi14 || 50;
      const macd = latest.macdHist || 0;
      const close = latest.close;
      const ema50 = latest.ema50 || close;

      let trend = 'Neutral';
      let confidence = 50.0;

      // Classify using simple Technical analysis heuristics
      if (close > ema50 && rsi > 55 && macd > 0) {
        trend = 'Bullish';
        confidence = Math.min(65 + (rsi - 55) * 1.5, 90);
      } else if (close < ema50 && rsi < 45 && macd < 0) {
        trend = 'Bearish';
        confidence = Math.min(65 + (45 - rsi) * 1.5, 90);
      } else {
        trend = 'Neutral';
        confidence = 50.0 + Math.abs(rsi - 50) * 0.5;
      }

      return {
        symbol,
        trend,
        confidence: Number(confidence.toFixed(2)),
        source: 'Heuristic Engine (Local Fallback)',
        message: 'ML service was unreachable. Prediction computed via local technical indicator metrics.',
        indicators: {
          rsi,
          macd,
          trend: close > ema50 ? 'Above Major EMA' : 'Below Major EMA',
        },
        features: {
          'RSI 14': 0.35,
          'MACD Hist': 0.25,
          'EMA 50 Bias': 0.40,
        },
      };
    }
  }

  async triggerModelTraining(symbol: string) {
    const history = await this.stockService.getEnrichedPriceHistory(symbol.toUpperCase());
    if (history.length < 50) {
      return {
        success: false,
        message: 'Insufficient data points for training (minimum 50 required).',
      };
    }

    try {
      const response = await axios.post(`${this.mlServiceUrl}/train`, {
        symbol,
        history,
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Model training failed: ${error.message}`);
      return {
        success: false,
        message: `Connection to ML Microservice failed: ${error.message}`,
      };
    }
  }
}
