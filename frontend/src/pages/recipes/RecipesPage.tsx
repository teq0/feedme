import { useState, useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { recipeService } from '../../services/apiService';
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

// Mock data for recipes
const MOCK_RECIPES = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    imageUrl: 'https://source.unsplash.com/random/300x200/?pasta',
    cookingTime: 30,
    cuisineType: 'Italian',
    dietaryRestrictions: ['Dairy'],
    suitableMealTypes: ['Lunch', 'Dinner'],
  },
  {
    id: '2',
    name: 'Vegetable Curry',
    imageUrl: 'https://source.unsplash.com/random/300x200/?curry',
    cookingTime: 45,
    cuisineType: 'Indian',
    dietaryRestrictions: ['Vegetarian', 'Gluten-Free'],
    suitableMealTypes: ['Lunch', 'Dinner'],
  },
  {
    id: '3',
    name: 'Chicken Stir Fry',
    imageUrl: 'https://source.unsplash.com/random/300x200/?stirfry',
    cookingTime: 20,
    cuisineType: 'Chinese',
    dietaryRestrictions: [],
    suitableMealTypes: ['Lunch', 'Dinner'],
  },
  {
    id: '4',
    name: 'Greek Salad',
    imageUrl: 'https://source.unsplash.com/random/300x200/?salad',
    cookingTime: 15,
    cuisineType: 'Greek',
    dietaryRestrictions: ['Vegetarian'],
    suitableMealTypes: ['Lunch'],
  },
  {
    id: '5',
    name: 'Beef Tacos',
    imageUrl: 'https://source.unsplash.com/random/300x200/?tacos',
    cookingTime: 25,
    cuisineType: 'Mexican',
    dietaryRestrictions: ['Dairy'],
    suitableMealTypes: ['Lunch', 'Dinner'],
  },
  {
    id: '6',
    name: 'Mushroom Risotto',
    imageUrl: 'https://source.unsplash.com/random/300x200/?risotto',
    cookingTime: 40,
    cuisineType: 'Italian',
    dietaryRestrictions: ['Vegetarian', 'Gluten-Free'],
    suitableMealTypes: ['Dinner'],
  },
  {
    id: '7',
    name: 'Pancakes',
    imageUrl: 'https://source.unsplash.com/random/300x200/?pancakes',
    cookingTime: 20,
    cuisineType: 'American',
    dietaryRestrictions: ['Vegetarian'],
    suitableMealTypes: ['Breakfast'],
  },
  {
    id: '8',
    name: 'Avocado Toast',
    imageUrl: 'https://source.unsplash.com/random/300x200/?avocado',
    cookingTime: 10,
    cuisineType: 'American',
    dietaryRestrictions: ['Vegetarian'],
    suitableMealTypes: ['Breakfast'],
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

// Meal types for filter
const MEAL_TYPES = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack',
];

/**
 * Recipes page component
 */
const RecipesPage = () => {
  const { isAuthenticated, accessToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('All');
  const [mealTypeFilter, setMealTypeFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [recipes, setRecipes] = useState<typeof MOCK_RECIPES>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const recipesPerPage = 6;

  // Fetch recipes from API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setApiError(null);
        
        const recipes = await recipeService.getAllRecipes(accessToken);
        // Define interface for dietary restriction object
        interface DietaryRestrictionObj {
          id: string;
          restriction: string;
          recipeId: string;
          createdAt?: string;
          updatedAt?: string;
        }
        
        // Transform the data to match the expected format
        const transformedRecipes = recipes.map(recipe => ({
          ...recipe,
          // Transform dietaryRestrictions from objects to strings
          dietaryRestrictions: recipe.dietaryRestrictions
            ? recipe.dietaryRestrictions.map((r: string | DietaryRestrictionObj) =>
                typeof r === 'string' ? r : r.restriction)
            : [],
          // Transform suitableMealTypes from string to array if needed
          suitableMealTypes: recipe.suitableMealTypes
            ? (typeof recipe.suitableMealTypes === 'string'
                ? recipe.suitableMealTypes.split(',')
                : recipe.suitableMealTypes)
            : []
        }));
        
        setRecipes(transformedRecipes || []);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setApiError('Failed to load recipes. Please try again later.');
        // Use mock data as fallback
        setRecipes(MOCK_RECIPES);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, [accessToken]);

  // Filter recipes based on search term, cuisine filter, and meal type filter
  const filteredRecipes = useMemo(() => {
    let result = [...recipes];

    // Apply search filter
    if (searchTerm) {
      result = result.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply cuisine filter
    if (cuisineFilter !== 'All') {
      result = result.filter(
        (recipe) => recipe.cuisineType === cuisineFilter
      );
    }

    // Apply meal type filter
    if (mealTypeFilter !== 'All') {
      result = result.filter((recipe) =>
        recipe.suitableMealTypes?.includes(mealTypeFilter)
      );
    }

    return result;
  }, [recipes, searchTerm, cuisineFilter, mealTypeFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, cuisineFilter, mealTypeFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const displayedRecipes = filteredRecipes.slice(
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
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
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
              label="Cuisine Type"
            >
              {CUISINE_TYPES.map((cuisine) => (
                <MenuItem key={cuisine} value={cuisine}>
                  {cuisine}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              value={mealTypeFilter}
              onChange={(e) => setMealTypeFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterIcon />
                  </InputAdornment>
                ),
              }}
              label="Meal Type"
            >
              {MEAL_TYPES.map((mealType) => (
                <MenuItem key={mealType} value={mealType}>
                  {mealType}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {/* Loading state */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography>Loading recipes...</Typography>
        </Box>
      ) : apiError ? (
        // Error state
        <Card sx={{ mt: 2 }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="error" gutterBottom>
              {apiError}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please try again later or contact support if the problem persists.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        // Recipe grid
        <>
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
        </>
      )}
    </Container>
  );
};

export default RecipesPage;