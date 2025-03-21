import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import RecipeCard from '../../components/recipes/RecipeCard';
import { useAuth } from '../../hooks/useAuth';

// Mock data for recipes
const MOCK_RECIPES = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    imageUrl: 'https://source.unsplash.com/random/300x200/?pasta',
    cookingTime: 30,
    cuisineType: 'Italian',
    dietaryRestrictions: ['Dairy'],
  },
  {
    id: '2',
    name: 'Vegetable Curry',
    imageUrl: 'https://source.unsplash.com/random/300x200/?curry',
    cookingTime: 45,
    cuisineType: 'Indian',
    dietaryRestrictions: ['Vegetarian', 'Gluten-Free'],
  },
  {
    id: '3',
    name: 'Chicken Stir Fry',
    imageUrl: 'https://source.unsplash.com/random/300x200/?stirfry',
    cookingTime: 20,
    cuisineType: 'Chinese',
    dietaryRestrictions: [],
  },
  {
    id: '4',
    name: 'Greek Salad',
    imageUrl: 'https://source.unsplash.com/random/300x200/?salad',
    cookingTime: 15,
    cuisineType: 'Greek',
    dietaryRestrictions: ['Vegetarian'],
  },
  {
    id: '5',
    name: 'Beef Tacos',
    imageUrl: 'https://source.unsplash.com/random/300x200/?tacos',
    cookingTime: 25,
    cuisineType: 'Mexican',
    dietaryRestrictions: ['Dairy'],
  },
  {
    id: '6',
    name: 'Mushroom Risotto',
    imageUrl: 'https://source.unsplash.com/random/300x200/?risotto',
    cookingTime: 40,
    cuisineType: 'Italian',
    dietaryRestrictions: ['Vegetarian', 'Gluten-Free'],
  },
];

// Cuisine types for filter
const CUISINE_TYPES = [
  'All',
  'Italian',
  'Indian',
  'Chinese',
  'Mexican',
  'Greek',
  'Japanese',
  'Thai',
  'French',
  'American',
];

/**
 * Recipes page component
 */
const RecipesPage = () => {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [recipes, setRecipes] = useState(MOCK_RECIPES);
  const recipesPerPage = 6;

  // Filter recipes based on search term and cuisine filter
  useEffect(() => {
    let filteredRecipes = MOCK_RECIPES;

    // Apply search filter
    if (searchTerm) {
      filteredRecipes = filteredRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply cuisine filter
    if (cuisineFilter !== 'All') {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.cuisineType === cuisineFilter
      );
    }

    setRecipes(filteredRecipes);
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, cuisineFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(recipes.length / recipesPerPage);
  const displayedRecipes = recipes.slice(
    (page - 1) * recipesPerPage,
    page * recipesPerPage
  );

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Recipes
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/recipes/new"
          >
            Add Recipe
          </Button>
        </Box>

        {/* Filters */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              value={cuisineFilter}
              onChange={(e) => setCuisineFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterIcon />
                  </InputAdornment>
                ),
              }}
            >
              {CUISINE_TYPES.map((cuisine) => (
                <MenuItem key={cuisine} value={cuisine}>
                  {cuisine}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {/* Recipe grid */}
      {displayedRecipes.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {displayedRecipes.map((recipe) => (
              <Grid item key={recipe.id} xs={12} sm={6} md={4}>
                <RecipeCard recipe={recipe} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      ) : (
        <Card sx={{ mt: 2 }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No recipes found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filters, or add a new recipe.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default RecipesPage;