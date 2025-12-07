import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  Box,
  Avatar,
  IconButton,
} from '@mui/material';
import { CoinListTableProps } from '../types/types';

export interface CoinListTablePropsExtended extends CoinListTableProps {
    onViewDetails: (coinId: string) => void;
}

const getChangeColor = (value) => {
  if (value > 0) return 'success.main';
  if (value < 0) return 'error.main';
  return 'text.primary';
};

const CoinListTable = ({
  coins,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
  onViewDetails,
}) => {
  const VisibilityIcon ='👁️'
  const isNextButtonDisabled = coins.length === 0 && page > 0;
  const startIndex = page * perPage + 1;
  const endIndex = startIndex + coins.length - 1;

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table sx={{ minWidth: 650 }} aria-label="Cryptocurrency market data">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'action.hover' }}>
            <TableCell>#</TableCell>
            <TableCell>Coin</TableCell>
            <TableCell align="right">Current Price (USD)</TableCell>
            <TableCell align="right">24H High</TableCell>
            <TableCell align="right">24H Low</TableCell>
            <TableCell align="right">24H Change</TableCell>
            <TableCell align="center">Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coins.map((coin, index) => (
            <TableRow
              key={coin.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'action.selected' } }}
            >
              <TableCell component="th" scope="row">
                {(page * perPage) + index + 1}
              </TableCell>
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={coin.image} alt={coin.name} sx={{ width: 24, height: 24, mr: 1 }} />
                  <Typography variant="body1" fontWeight="bold">
                    {coin.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                    ({coin.symbol.toUpperCase()})
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">${coin.current_price?.toLocaleString()}</TableCell>
              <TableCell align="right">${coin.high_24h?.toLocaleString()}</TableCell>
              <TableCell align="right">${coin.low_24h?.toLocaleString()}</TableCell>
              <TableCell align="right">
                <Typography
                  fontWeight="bold"
                  color={getChangeColor(coin.price_change_percentage_24h)}
                >
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </Typography>
              </TableCell>
              <TableCell align="center">
                <IconButton
                    aria-label={`View details for ${coin.name}`}
                    onClick={() => onViewDetails(coin.id)}
                    color="primary"
                >
                    {VisibilityIcon}
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={1000000}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={perPage}
        onRowsPerPageChange={onPerPageChange}
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelDisplayedRows={() => {
          if (coins.length === 0 && page > 0) {
              return `End of list (last item: ${startIndex - 1})`;
          }
          return `${startIndex}-${endIndex} of many`;
        }}
        nextIconButtonProps={{
            disabled: isNextButtonDisabled,
        }}
      />
    </TableContainer>
  );
};

export default CoinListTable;