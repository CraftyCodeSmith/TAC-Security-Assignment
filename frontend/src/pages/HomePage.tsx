import React, { useState, useEffect } from 'react';
import CoinListTable from '../components/CoinListTable';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/coins';

const HomePage = () => {
  const [coins, setCoins] = useState([]);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const TOTAL_COINS_MOCK = 13000;

  const fetchCoins = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}`, {
        params: {
          page: page + 1,
          perPage: perPage,
        },
      });
      setCoins(response.data);
    } catch (err) {
      setError('Failed to fetch coin data. Check your API key and backend service.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, [page, perPage]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handlePerPageChange = (event) => {
    setPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Cryptocurrency Market List
      </Typography>
      <CoinListTable
        coins={coins}
        page={page}
        perPage={perPage}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />
    </Box>
  );
};

export default HomePage;