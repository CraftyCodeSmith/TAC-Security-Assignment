export interface CoinDetailsData {
    name: string;
    symbol: string;
    description: string;
    currentPriceUSD: number;
    high24hUSD: number;
    low24hUSD: number;
    priceChanges: {
        '24h'?: number;
        '7d'?: number;
        '14d'?: number;
        '1 month (30d)'?: number;
        '2 months (60d)'?: number;
        '200 days'?: number;
        '1 year'?: number;
    };
}

export interface CoinDetailCardProps {
    coinId: string;
    onClose: () => void;
}