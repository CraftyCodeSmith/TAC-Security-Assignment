export interface CoinData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  high_24h: number;
  low_24h: number;
  price_change_percentage_24h: number;
  image: string;
}

export interface CoinListTableProps {
  coins: CoinData[];
  page: number;
  perPage: number;
  totalCoins: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}