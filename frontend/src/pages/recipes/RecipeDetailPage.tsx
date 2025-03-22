import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { recipeService } from '../../services/apiService';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardMedia,
  Chip,
  Container,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Restaurant as CuisineIcon,
  ShoppingBasket as IngredientIcon,
} from '@mui/icons-material';

// Mock recipe data
const MOCK_RECIPE = {
  id: '1',
  name: 'Spaghetti Carbonara',
  imageUrl: 'https://source.unsplash.com/random/1200x600/?pasta',
  preparationSteps: `1. Bring a large pot of salted water to a boil. Add the spaghetti and cook until al dente, about 8-10 minutes.

2. Meanwhile, in a large skillet, cook the pancetta over medium heat until crispy, about 5-7 minutes. Remove from heat and set aside.

3. In a bowl, whisk together the eggs, grated Pecorino Romano, and black pepper.

4. When the pasta is done, reserve 1/2 cup of the pasta water, then drain the pasta.

5. Working quickly, add the hot pasta to the skillet with the pancetta. Toss to combine.

6. Remove the skillet from heat and add the egg mixture, tossing quickly to coat the pasta before the eggs scramble. If needed, add a splash of the reserved pasta water to create a creamy sauce.

7. Serve immediately, topped with additional grated cheese and black pepper.`,
  cookingTime: 30,
  cuisineType: 'Italian',
  dietaryRestrictions: ['Dairy'],
  ingredients: [
    { name: 'Spaghetti', quantity: 400, unit: 'g' },
    { name: 'Pancetta', quantity: 150, unit: 'g' },
    { name: 'Eggs', quantity: 3, unit: 'large' },
    { name: 'Pecorino Romano', quantity: 50, unit: 'g' },
    { name: 'Black Pepper', quantity: 1, unit: 'tsp' },
    { name: 'Salt', quantity: 1, unit: 'to taste' },
  ],
};

/**
 * Recipe detail page component
 */
const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const [recipe, setRecipe] = useState<typeof MOCK_RECIPE | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define interface for dietary restriction object
  interface DietaryRestrictionObj {
    id: string;
    restriction: string;
    recipeId: string;
    createdAt?: string;
    updatedAt?: string;
  }

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const recipeData = await recipeService.getRecipeById(id, accessToken);
        
        // Transform the data to match the expected format
        const transformedRecipe = {
          ...recipeData,
          // Transform dietaryRestrictions from objects to strings
          dietaryRestrictions: recipeData.dietaryRestrictions
            ? recipeData.dietaryRestrictions.map((r: string | DietaryRestrictionObj) =>
                typeof r === 'string' ? r : r.restriction)
            : [],
          // Transform suitableMealTypes from string to array if needed
          suitableMealTypes: recipeData.suitableMealTypes
            ? (typeof recipeData.suitableMealTypes === 'string'
                ? recipeData.suitableMealTypes.split(',')
                : recipeData.suitableMealTypes)
            : []
        };
        
        setRecipe(transformedRecipe);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setError('Failed to load recipe. Please try again later.');
        // Use mock data as fallback
        setRecipe(MOCK_RECIPE);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipe();
  }, [id, accessToken]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }
  
  if (!recipe) {
    return (
      <Container maxWidth="lg">
        <Typography>Recipe not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/recipes" color="inherit">
          Recipes
        </Link>
        <Typography color="text.primary">{recipe.name}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          component={RouterLink}
          to="/recipes"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Recipes
        </Button>
        <Button
          component={RouterLink}
          to={`/recipes/edit/${recipe.id}`}
          variant="contained"
          startIcon={<EditIcon />}
        >
          Edit Recipe
        </Button>
      </Box>

      {/* Recipe content */}
      <Grid container spacing={4}>
        {/* Left column - Image and details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              height="300"
              image={recipe.imageUrl}
              alt={recipe.name}
            />
          </Card>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {recipe.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TimeIcon sx={{ mr: 1 }} color="action" />
              <Typography variant="body1" color="text.secondary">
                {recipe.cookingTime} minutes
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CuisineIcon sx={{ mr: 1 }} color="action" />
              <Typography variant="body1" color="text.secondary">
                {recipe.cuisineType} Cuisine
              </Typography>
            </Box>

            {recipe.dietaryRestrictions.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Dietary Information:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {recipe.dietaryRestrictions.map((restriction) => (
                    <Chip key={restriction} label={restriction} size="small" />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ingredients
            </Typography>
            <List>
              {recipe.ingredients.map((ingredient, index) => (
                <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <IngredientIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Right column - Preparation steps */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Preparation Steps
            </Typography>
            <Typography
              variant="body1"
              component="div"
              sx={{ whiteSpace: 'pre-line' }}
            >
              {recipe.preparationSteps}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecipeDetailPage;