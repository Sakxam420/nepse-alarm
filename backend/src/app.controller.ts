import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      status: 'online',
      service: 'NEPSE AI Stock Prediction & Decision Support System',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      documentation: '/api/v1',
      endpoints: {
        apiRoot: '/api/v1',
        stocks: '/api/v1/stocks',
        marketSummary: '/api/v1/stocks/market/summary',
        topMovers: '/api/v1/stocks/top/movers',
        alerts: '/api/v1/alerts',
        portfolio: '/api/v1/portfolio',
        auth: '/api/v1/auth',
      },
    };
  }

  @Get('api/v1')
  getApiV1() {
    return {
      status: 'online',
      message: 'NEPSE AI Backend API is active and operational',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      routes: [
        { path: '/api/v1/stocks', method: 'GET', description: 'List all NEPSE listed companies' },
        { path: '/api/v1/stocks/market/summary', method: 'GET', description: 'NEPSE Index, turnover, advance/decline' },
        { path: '/api/v1/stocks/top/movers', method: 'GET', description: 'Top gainers, top losers, volume leaders' },
        { path: '/api/v1/stocks/:symbol/history', method: 'GET', description: 'Daily OHLCV candlestick records' },
        { path: '/api/v1/stocks/:symbol/enriched', method: 'GET', description: 'OHLCV with calculated EMA, RSI, MACD' },
        { path: '/api/v1/stocks/:symbol/prediction', method: 'GET', description: 'Two-stage LSTM + XGBoost ML prediction' },
        { path: '/api/v1/alerts', method: 'GET/POST', description: 'Real-time price & indicator alerts' },
        { path: '/api/v1/portfolio', method: 'GET/POST', description: 'Paper trading portfolio tracker' },
        { path: '/api/v1/auth/login', method: 'POST', description: 'User authentication' },
        { path: '/api/v1/auth/register', method: 'POST', description: 'User account creation' },
      ],
    };
  }

  @Get('api/v1/health')
  getHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'nepse-ai-backend',
    };
  }
}
