import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

/**
 * Auth callback component for handling social login redirects
 */
const AuthCallback = () => {
  const { setAuthTokens } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const errorMessage = params.get('error');

    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
      return;
    }

    if (accessToken && refreshToken) {
      // Set auth tokens and redirect to home
      setAuthTokens(accessToken, refreshToken);
      navigate('/');
    } else {
      setError('Authentication failed. Missing tokens.');
    }
  }, [location, navigate, setAuthTokens]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
      }}
    >
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          <CircularProgress size={60} sx={{ mb: 4 }} />
          <Typography variant="h6">Completing authentication...</Typography>
        </>
      )}
    </Box>
  );
};

export default AuthCallback;