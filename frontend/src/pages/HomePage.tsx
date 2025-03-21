import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Paper,
} from '@mui/material';
import {
  RestaurantMenu as RecipeIcon,
  Kitchen as InventoryIcon,
  CalendarMonth as PlanIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

/**
 * Home page component
 */
const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [timeOfDay, setTimeOfDay] = useState('');

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setTimeOfDay('morning');
    } else if (hour < 18) {
      setTimeOfDay('afternoon');
    } else {
      setTimeOfDay('evening');
    }
  }, []);

  return (
    <Container maxWidth="lg">
      {/* Hero section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          mt: 2,
          borderRadius: 2,
          backgroundColor: 'primary.light',
          color: 'primary.contrastText',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {isAuthenticated
            ? `Good ${timeOfDay}, ${user?.name}!`
            : 'Welcome to FeedMe!'}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          {isAuthenticated
            ? 'Your personal recipe management and meal planning assistant.'
            : 'Discover, plan, and cook with ease.'}
        </Typography>
        {!isAuthenticated && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              component={RouterLink}
              to="/auth/register"
              size="large"
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              component={RouterLink}
              to="/auth/login"
              size="large"
            >
              Login
            </Button>
          </Box>
        )}
      </Paper>

      {/* Feature cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RecipeIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" component="h2">
                  Recipes
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                Discover and manage your favorite recipes. Add your own or browse our collection.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/recipes"
                disabled={!isAuthenticated}
              >
                View Recipes
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InventoryIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" component="h2">
                  Inventory
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                Keep track of your ingredients and get notified when they're about to expire.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/inventory"
                disabled={!isAuthenticated}
              >
                Manage Inventory
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PlanIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" component="h2">
                  Meal Planning
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                Plan your meals for the week and generate shopping lists automatically.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/meal-plans"
                disabled={!isAuthenticated}
              >
                Plan Meals
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;