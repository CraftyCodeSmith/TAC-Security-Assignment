import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Avatar,
    IconButton,
    Grid,
    Divider,
    useTheme,
} from '@mui/material';
import { CoinDetailsData, CoinDetailCardProps } from '../types/CoinDetails';
import axios from 'axios';

const DETAILS_API_BASE_URL = 'http://localhost:3000/coins';

const getChangeColor = (value, theme) => {
  if (value > 0) return theme.palette.success.main;
  if (value < 0) return theme.palette.error.main;
  return theme.palette.text.primary;
};

const CoinDetailCard = ({ coinId, onClose }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${DETAILS_API_BASE_URL}/${coinId}`);
                setDetails(response.data);
            } catch (err) {
                console.error("Error fetching coin details:", err.response?.data?.message || err.message);
                setError(`Failed to fetch details for ${coinId}. Please ensure the backend is running and the /coins/:id route is implemented.`);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [coinId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (<Alert severity="error" sx={{ m: 2 }}>{error}</Alert>);
    }

    if (!details) {
        return (
            <Alert severity="warning" sx={{ m: 2 }} action={
                <IconButton size="small" onClick={onClose}>🔙</IconButton>
            }>
                Could not load coin data. Please try again.
            </Alert>
        );
    }

    const currentPrice = details.currentPriceUSD;
    const high24h = details.high24hUSD;
    const low24h = details.low24hUSD;
    const descriptionEn = details.description;
    const priceChanges = details.priceChanges;

    const displayPeriods = ['24h', '7d', '14d', '1 month (30d)', '2 months (60d)', '200 days', '1 year'];


    return (
        <Card sx={{ maxWidth: 800, margin: '20px auto', p: 2 }} elevation={5}>
            <CardContent>
                <IconButton onClick={onClose} sx={{ mb: 2 }}>
                    🔙
                </IconButton>

                <Box display="flex" alignItems="center" mb={3}>
                    <Avatar
                        alt={details.name}
                        sx={{ width: 64, height: 64, mr: 2 }}
                    />
                    <Box>
                        <Typography variant="h4" component="div" fontWeight="bold">
                            {details.name}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {details.symbol?.toUpperCase()}
                        </Typography>
                    </Box>
                </Box>

<Typography
    variant="body1"
    paragraph
    dangerouslySetInnerHTML={{
        __html: descriptionEn
    }}
/>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                    <Grid size={{xs:12}}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Current Price: **${currentPrice?.toLocaleString() || 'N/A'}**
                        </Typography>
                    </Grid>

                    <Grid size={{xs:6}} >
                        <Typography variant="body2" color="success.main">
                            24h High: **${high24h?.toLocaleString() || 'N/A'}**
                        </Typography>
                    </Grid>
                    <Grid size={{xs:6}} >
                        <Typography variant="body2" color="error.main">
                            24h Low: **${low24h?.toLocaleString() || 'N/A'}**
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>Price Changes (%)</Typography>
                <Grid container spacing={1}>
                    {displayPeriods.map((periodKey) => {
                        const value = priceChanges[periodKey];
                        return (
                            <Grid size={{xs:4,sm:2}} key={periodKey}>
                                <Typography variant="caption" color="text.secondary">{periodKey.toUpperCase()}</Typography>
                                <Typography
                                    fontWeight="bold"
                                    color={value ? getChangeColor(value, theme) : 'text.disabled'}
                                >
                                    {value ? `${value.toFixed(2)}%` : 'N/A'}
                                </Typography>
                            </Grid>
                        );
                    })}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default CoinDetailCard;