import React, { useEffect, useState } from 'react'
import './App.css'
import CoinListTable from './components/CoinListTable'
import CoinDetailCard from './components/CoinDetailCard'
import { CssBaseline, Box, Typography, Alert, CircularProgress } from '@mui/material'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/coins/markets';
const TOTAL_COINS_MOCK = 13000;

function App() {
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [selectedCoinId, setSelectedCoinId] = useState(null)

  async function fetchCoins() {
    if (selectedCoinId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await axios.get(API_BASE_URL, {
        params: {
          page: page + 1,
          per_page: perPage
        }
      })

      setCoins(result.data)

    } catch (error) {
      console.error("Error fetching coins:", error)
      setError("Failed to fetch market data. Check your backend and API key.");
    } finally {
      setLoading(false);
    }
  }

  function onPageChange(event, newPage) {
    setPage(newPage)
  }
  function onPerPageChange(event) {
    setPerPage(parseInt(event.target.value, 10))
    setPage(0);
  }

  function onViewDetails(coinId) {
    setSelectedCoinId(coinId);
  }

  function onCloseDetails() {
    setSelectedCoinId(null);
  }

  useEffect(() => {
    fetchCoins()
  },[page, perPage, selectedCoinId])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
    );
  }

  return (
   <React.Fragment>
      <CssBaseline />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
            Cryptocurrency Tracker
        </Typography>

        {selectedCoinId ? (
          <CoinDetailCard
            coinId={selectedCoinId}
            onClose={onCloseDetails}
          />
        ) : (
          <CoinListTable
            coins={coins}
            page={page}
            perPage={perPage}
            totalCoins={TOTAL_COINS_MOCK}
            onPageChange={onPageChange}
            onPerPageChange={onPerPageChange}
            onViewDetails={onViewDetails}
          />
        )}
      </Box>
    </React.Fragment>
  )
}

export default App