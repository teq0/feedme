import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Typography,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Shuffle as ShuffleIcon,
  Kitchen as IngredientIcon,
  LocalDining as CuisineIcon,
  FoodBank as DietaryIcon,
  Restaurant as MealTypeIcon,
} from '@mui/icons-material';
import RecipeCard from '../../components/recipes/RecipeCard';

// Recipe interface with optional match score
interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  cookingTime: number;
  cuisineType: string;
  dietaryRestrictions: string[];
  suitableMealTypes: string[];
  matchScore?: number;
}

// Mock data for recipes
const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    imageUrl: 'https://source.unsplash.com/random/300x200/?pasta',
    cookingTime: 30,
    cuisineType: 'Italian',
    dietaryRestrictions: ['Dairy'],
    suitableMealTypes: ['lunch', 'dinner'],
  },
  {
    id: '2',
    name: 'Vegetable Curry',
    imageUrl: 'https://source.unsplash.com/random/300x200/?curry',
    cookingTime: 45,
    cuisineType: 'Indian',
    dietaryRestrictions: ['Vegetarian', 'Gluten-Free'],
    suitableMealTypes: ['lunch', 'dinner'],
  },
  {
    id: '3',
    name: 'Chicken Stir Fry',
    imageUrl: 'https://source.unsplash.com/random/300x200/?stirfry',
    cookingTime: 20,
    cuisineType: 'Chinese',
    dietaryRestrictions: [],
    suitableMealTypes: ['lunch', 'dinner'],
  },
  {
    id: '4',
    name: 'Greek Salad',
    imageUrl: 'https://source.unsplash.com/random/300x200/?salad',
    cookingTime: 15,
    cuisineType: 'Greek',
    dietaryRestrictions: ['Vegetarian'],
    suitableMealTypes: ['lunch'],
  },
  {
    id: '5',
    name: 'Beef Tacos',
    imageUrl: 'https://source.unsplash.com/random/300x200/?tacos',
    cookingTime: 25,
    cuisineType: 'Mexican',
    dietaryRestrictions: ['Dairy'],
    suitableMealTypes: ['lunch', 'dinner'],
  },
  {
    id: '6',
    name: 'Mushroom Risotto',
    imageUrl: 'https://source.unsplash.com/random/300x200/?risotto',
    cookingTime: 40,
    cuisineType: 'Italian',
    dietaryRestrictions: ['Vegetarian', 'Gluten-Free'],
    suitableMealTypes: ['dinner'],
  },
  {
    id: '7',
    name: 'Grilled Salmon',
    imageUrl: 'https://source.unsplash.com/random/300x200/?salmon',
    cookingTime: 25,
    cuisineType: 'American',
    dietaryRestrictions: ['Gluten-Free'],
    suitableMealTypes: ['lunch', 'dinner'],
  },
  {
    id: '8',
    name: 'Pancakes',
    imageUrl: 'https://source.unsplash.com/random/300x200/?pancakes',
    cookingTime: 20,
    cuisineType: 'American',
    dietaryRestrictions: ['Vegetarian'],
    suitableMealTypes: ['breakfast'],
  },
];

// Mock data for user ingredients
const MOCK_USER_INGREDIENTS = [
  { id: '1', name: 'Chicken Breast' },
  { id: '2', name: 'Rice' },
  { id: '3', name: 'Pasta' },
  { id: '4', name: 'Tomatoes' },
  { id: '5', name: 'Onions' },
  { id: '6', name: 'Garlic' },
  { id: '7', name: 'Olive Oil' },
  { id: '8', name: 'Eggs' },
  { id: '9', name: 'Cheese' },
  { id: '10', name: 'Bell Peppers' },
];

// Cuisine types
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

// Dietary restrictions
const DIETARY_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Low-Carb',
  'Keto',
  'Paleo',
];

// Meal types
const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
];

/**
 * Recommendations page component
 */
const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState<Recipe[]>([]);
  const [useIngredients, setUseIngredients] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>(['dinner']); // Default to dinner
  const [loading, setLoading] = useState(false);

  // Generate recommendations on initial load
  useEffect(() => {
    generateRecommendations();
  }, []);

  // Generate recipe recommendations
  const generateRecommendations = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Filter recipes based on criteria
      let filteredRecipes = [...MOCK_RECIPES];
      
      // Apply cuisine filter
      if (selectedCuisine !== 'All') {
        filteredRecipes = filteredRecipes.filter(
          (recipe) => recipe.cuisineType === selectedCuisine
        );
      }
      
      // Apply dietary restrictions filter
      if (selectedDietary.length > 0) {
        filteredRecipes = filteredRecipes.filter((recipe) =>
          selectedDietary.every((restriction) =>
            recipe.dietaryRestrictions.includes(restriction)
          )
        );
      }
      
      // Apply meal type filter
      if (selectedMealTypes.length > 0) {
        filteredRecipes = filteredRecipes.filter((recipe) =>
          selectedMealTypes.some((mealType) =>
            recipe.suitableMealTypes.includes(mealType)
          )
        );
      }
      
      // If using ingredients, prioritize recipes that use available ingredients
      // This is a simplified version - in a real app, this would be more sophisticated
      if (useIngredients) {
        // Simulate ingredient matching by randomly assigning a match score
        filteredRecipes = filteredRecipes.map((recipe) => ({
          ...recipe,
          matchScore: Math.floor(Math.random() * 100),
        }));
        
        // Sort by match score
        filteredRecipes.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      } else {
        // Randomize the order
        filteredRecipes.sort(() => Math.random() - 0.5);
      }
      
      // Calculate how many recipes to recommend based on meal types
      const recipesNeeded = selectedMealTypes.length;
      
      // Take the required number of recipes
      setRecommendations(filteredRecipes.slice(0, recipesNeeded));
      setLoading(false);
    }, 1000);
  };

  // Generate random recommendations
  const generateRandomRecommendations = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Calculate how many recipes to recommend based on meal types
      const recipesNeeded = selectedMealTypes.length;
      
      // Randomly select recipes
      const shuffled = [...MOCK_RECIPES].sort(() => Math.random() - 0.5);
      setRecommendations(shuffled.slice(0, recipesNeeded));
      setLoading(false);
    }, 1000);
  };

  // Handle dietary restriction toggle
  const handleDietaryToggle = (restriction: string) => {
    if (selectedDietary.includes(restriction)) {
      setSelectedDietary(selectedDietary.filter((r) => r !== restriction));
    } else {
      setSelectedDietary([...selectedDietary, restriction]);
    }
  };

  // Handle meal type toggle
  const handleMealTypeToggle = (mealType: string) => {
    if (selectedMealTypes.includes(mealType)) {
      // Don't allow deselecting all meal types
      if (selectedMealTypes.length > 1) {
        setSelectedMealTypes(selectedMealTypes.filter((m) => m !== mealType));
      }
    } else {
      setSelectedMealTypes([...selectedMealTypes, mealType]);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Recipe Recommendations
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Get personalized recipe recommendations based on your preferences and available ingredients.
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IngredientIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">Ingredients</Typography>
            </Box>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={useIngredients}
                    onChange={(e) => setUseIngredients(e.target.checked)}
                  />
                }
                label="Use my available ingredients"
              />
            </FormGroup>
            {useIngredients && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Available Ingredients:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {MOCK_USER_INGREDIENTS.map((ingredient) => (
                    <Chip
                      key={ingredient.id}
                      label={ingredient.name}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CuisineIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">Cuisine</Typography>
            </Box>
            <FormControl fullWidth>
              <InputLabel id="cuisine-label">Cuisine Type</InputLabel>
              <Select
                labelId="cuisine-label"
                value={selectedCuisine}
                label="Cuisine Type"
                onChange={(e) => setSelectedCuisine(e.target.value)}
              >
                {CUISINE_TYPES.map((cuisine) => (
                  <MenuItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DietaryIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">Dietary Restrictions</Typography>
            </Box>
            <FormGroup>
              {DIETARY_RESTRICTIONS.map((restriction) => (
                <FormControlLabel
                  key={restriction}
                  control={
                    <Switch
                      checked={selectedDietary.includes(restriction)}
                      onChange={() => handleDietaryToggle(restriction)}
                    />
                  }
                  label={restriction}
                />
              ))}
            </FormGroup>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MealTypeIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">Meal Types</Typography>
            </Box>
            <FormGroup row>
              {MEAL_TYPES.map((mealType) => (
                <FormControlLabel
                  key={mealType.value}
                  control={
                    <Switch
                      checked={selectedMealTypes.includes(mealType.value)}
                      onChange={() => handleMealTypeToggle(mealType.value)}
                    />
                  }
                  label={mealType.label}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* Days Per Week selector removed as it doesn't make sense in the Recommendations page */}

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={generateRecommendations}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Recommendations'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShuffleIcon />}
                onClick={generateRandomRecommendations}
                disabled={loading}
              >
                Random Recommendations
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Recommendations */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recommended Recipes
          {selectedMealTypes.length > 0 && (
            <Typography variant="subtitle1" component="span" color="text.secondary" sx={{ ml: 2 }}>
              {selectedMealTypes.length === 1
                ? MEAL_TYPES.find(m => m.value === selectedMealTypes[0])?.label
                : `${selectedMealTypes.length} meal types`}
            </Typography>
          )}
        </Typography>
        {recommendations.length > 0 ? (
          <Grid container spacing={3}>
            {recommendations.map((recipe) => (
              <Grid item key={recipe.id} xs={12} sm={6} md={4}>
                <RecipeCard recipe={recipe} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No recommendations available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or click "Generate Recommendations" to get started.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default RecommendationsPage;