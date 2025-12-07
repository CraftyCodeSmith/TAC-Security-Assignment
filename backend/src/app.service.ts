import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getCoins(page = 1, perPage = 10) {
    try {
      const apiKey = this.configService.get('API_KEY') as string;
      if (!apiKey) throw new Error('API_KEY missing in environment variables!');

      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            page,
            per_page: perPage,
          },
          headers: {
            'x-cg-demo-api-key': apiKey,
          },
          timeout: 5000,
        },
      );

      return response.data as unknown[];
    } catch (error: any) {
      console.error('Error fetching coins:', error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  }

  async getCoinDetails(id: string) {
    try {
      const apiKey = this.configService.get<string>('API_KEY');
      if (!apiKey) throw new Error('API_KEY missing in environment variables!');

      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}`,
        {
          params: {
            localization: 'false',
            tickers: 'false',
            market_data: 'true',
            community_data: 'false',
            developer_data: 'false',
            sparkline: 'false',
          },
          headers: {
            'x-cg-demo-api-key': apiKey,
          },
          timeout: 5000,
        },
      );

      const data = response.data;

      const currentPriceUSD = data?.market_data?.current_price?.usd;
      const coinName = data?.name;
      const coinDescription =
        data?.description?.en || 'No description available.';

      const high24hUSD = data?.market_data?.high_24h?.usd;
      const low24hUSD = data?.market_data?.low_24h?.usd;

      const marketData = data?.market_data;
      const priceChanges = {
        '24h': marketData?.price_change_percentage_24h,
        '7d': marketData?.price_change_percentage_7d,
        '14d': marketData?.price_change_percentage_14d,
        '1 month (30d)': marketData?.price_change_percentage_30d,
        '2 months (60d)': marketData?.price_change_percentage_60d,
        '200 days': marketData?.price_change_percentage_200d,
        '1 year': marketData?.price_change_percentage_1y,
      };

      return {
        name: coinName,
        description: coinDescription,
        currentPriceUSD,
        high24hUSD,
        low24hUSD,
        priceChanges,
      };
    } catch (error: any) {
      console.error(`Error fetching coin details for ${id}:`, error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  }
}
