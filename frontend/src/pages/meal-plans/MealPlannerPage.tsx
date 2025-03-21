import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBackIos as PrevIcon,
  ArrowForwardIos as NextIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';

// Mock data for recipes
const MOCK_RECIPES = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    imageUrl: 'https://source.unsplash.com/random/300x200/?pasta',
    cookingTime: 30,
    cuisineType: 'Italian',
  },
  {
    id: '2',
    name: 'Vegetable Curry',
    imageUrl: 'https://source.unsplash.com/random/300x200/?curry',
    cookingTime: 45,
    cuisineType: 'Indian',
  },
  {
    id: '3',
    name: 'Chicken Stir Fry',
    imageUrl: 'https://source.unsplash.com/random/300x200/?stirfry',
    cookingTime: 20,
    cuisineType: 'Chinese',
  },
  {
    id: '4',
    name: 'Greek Salad',
    imageUrl: 'https://source.unsplash.com/random/300x200/?salad',
    cookingTime: 15,
    cuisineType: 'Greek',
  },
  {
    id: '5',
    name: 'Beef Tacos',
    imageUrl: 'https://source.unsplash.com/random/300x200/?tacos',
    cookingTime: 25,
    cuisineType: 'Mexican',
  },
  {
    id: '6',
    name: 'Mushroom Risotto',
    imageUrl: 'https://source.unsplash.com/random/300x200/?risotto',
    cookingTime: 40,
    cuisineType: 'Italian',
  },
];

// Meal types
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

// Days of the week
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Form values interface
interface MealFormValues {
  recipeId: string;
  mealType: string;
}

// Meal plan interface
interface MealPlan {
  id: string;
  startDate: Date;
  endDate: Date;
  meals: {
    id: string;
    day: string;
    mealType: string;
    recipeId: string;
  }[];
}

/**
 * Meal planner page component
 */
const MealPlannerPage = () => {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMealType, setSelectedMealType] = useState<string>('');

  // Initialize form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MealFormValues>({
    defaultValues: {
      recipeId: '',
      mealType: '',
    },
  });

  // Get start and end dates for the current week
  const getWeekDates = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(date);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return { startDate: monday, endDate: sunday };
  };

  // Load meal plan for the current week
  useEffect(() => {
    const { startDate, endDate } = getWeekDates(currentWeek);
    
    // In a real app, this would fetch data from the API
    // For now, we'll just create a mock meal plan
    const mockMealPlan: MealPlan = {
      id: '1',
      startDate,
      endDate,
      meals: [
        { id: '1', day: 'Monday', mealType: 'Breakfast', recipeId: '4' },
        { id: '2', day: 'Monday', mealType: 'Dinner', recipeId: '1' },
        { id: '3', day: 'Wednesday', mealType: 'Lunch', recipeId: '2' },
        { id: '4', day: 'Thursday', mealType: 'Dinner', recipeId: '3' },
        { id: '5', day: 'Saturday', mealType: 'Lunch', recipeId: '5' },
        { id: '6', day: 'Sunday', mealType: 'Dinner', recipeId: '6' },
      ],
    };
    
    setMealPlan(mockMealPlan);
  }, [currentWeek]);

  // Format date range for display
  const formatDateRange = () => {
    if (!mealPlan) return '';
    
    const startDate = mealPlan.startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    
    const endDate = mealPlan.endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    
    return `${startDate} - ${endDate}`;
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  // Reset to current week
  const resetToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  // Open dialog to add a meal
  const handleOpenDialog = (day: string, mealType: string) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    reset({
      recipeId: '',
      mealType,
    });
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle form submission
  const onSubmit = (data: MealFormValues) => {
    if (!mealPlan) return;
    
    // Check if there's already a meal for this day and meal type
    const existingMealIndex = mealPlan.meals.findIndex(
      (meal) => meal.day === selectedDay && meal.mealType === selectedMealType
    );
    
    if (existingMealIndex >= 0) {
      // Update existing meal
      const updatedMeals = [...mealPlan.meals];
      updatedMeals[existingMealIndex] = {
        ...updatedMeals[existingMealIndex],
        recipeId: data.recipeId,
      };
      
      setMealPlan({
        ...mealPlan,
        meals: updatedMeals,
      });
    } else {
      // Add new meal
      const newMeal = {
        id: Date.now().toString(),
        day: selectedDay,
        mealType: selectedMealType,
        recipeId: data.recipeId,
      };
      
      setMealPlan({
        ...mealPlan,
        meals: [...mealPlan.meals, newMeal],
      });
    }
    
    handleCloseDialog();
  };

  // Handle delete meal
  const handleDeleteMeal = (day: string, mealType: string) => {
    if (!mealPlan) return;
    
    const updatedMeals = mealPlan.meals.filter(
      (meal) => !(meal.day === day && meal.mealType === mealType)
    );
    
    setMealPlan({
      ...mealPlan,
      meals: updatedMeals,
    });
  };

  // Get recipe by ID
  const getRecipeById = (recipeId: string) => {
    return MOCK_RECIPES.find((recipe) => recipe.id === recipeId);
  };

  // Get meal for a specific day and meal type
  const getMeal = (day: string, mealType: string) => {
    if (!mealPlan) return null;
    
    return mealPlan.meals.find(
      (meal) => meal.day === day && meal.mealType === mealType
    );
  };

  // Generate a meal plan automatically
  const generateMealPlan = () => {
    if (!mealPlan) return;
    
    // Clear existing meals
    const newMealPlan: MealPlan = {
      ...mealPlan,
      meals: [],
    };
    
    // Generate random meals for each day and meal type
    DAYS_OF_WEEK.forEach((day) => {
      // For simplicity, we'll just add lunch and dinner
      ['Lunch', 'Dinner'].forEach((mealType) => {
        // Randomly select a recipe
        const randomRecipeIndex = Math.floor(Math.random() * MOCK_RECIPES.length);
        const randomRecipe = MOCK_RECIPES[randomRecipeIndex];
        
        newMealPlan.meals.push({
          id: `${day}-${mealType}-${Date.now()}`,
          day,
          mealType,
          recipeId: randomRecipe.id,
        });
      });
    });
    
    setMealPlan(newMealPlan);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Meal Planner
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={generateMealPlan}
          >
            Generate Plan
          </Button>
        </Box>

        {/* Week navigation */}
        <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton onClick={goToPreviousWeek} aria-label="Previous week">
            <PrevIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6">{formatDateRange()}</Typography>
            <Button size="small" onClick={resetToCurrentWeek}>
              Reset to Current Week
            </Button>
          </Box>
          
          <IconButton onClick={goToNextWeek} aria-label="Next week">
            <NextIcon />
          </IconButton>
        </Paper>
      </Box>

      {/* Meal plan grid */}
      <Grid container spacing={2}>
        {/* Header row with days */}
        <Grid item xs={2}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Meals
            </Typography>
          </Paper>
        </Grid>
        
        {DAYS_OF_WEEK.map((day) => (
          <Grid item xs={10 / 7} key={day}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {day}
              </Typography>
            </Paper>
          </Grid>
        ))}

        {/* Meal type rows */}
        {MEAL_TYPES.map((mealType) => (
          <React.Fragment key={mealType}>
            <Grid item xs={2}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="subtitle1">{mealType}</Typography>
              </Paper>
            </Grid>
            
            {DAYS_OF_WEEK.map((day) => {
              const meal = getMeal(day, mealType);
              const recipe = meal ? getRecipeById(meal.recipeId) : null;
              
              return (
                <Grid item xs={10 / 7} key={`${day}-${mealType}`}>
                  <Paper sx={{ p: 1, height: '100%', minHeight: 120 }}>
                    {recipe ? (
                      <Box sx={{ height: '100%', position: 'relative' }}>
                        <Box
                          component={RouterLink}
                          to={`/recipes/${recipe.id}`}
                          sx={{
                            display: 'block',
                            textDecoration: 'none',
                            color: 'inherit',
                          }}
                        >
                          <Typography variant="subtitle2" noWrap>
                            {recipe.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {recipe.cuisineType} • {recipe.cookingTime} min
                          </Typography>
                        </Box>
                        
                        <Box sx={{ position: 'absolute', bottom: 0, right: 0 }}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteMeal(day, mealType)}
                            aria-label="Remove meal"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Button
                          startIcon={<AddIcon />}
                          onClick={() => handleOpenDialog(day, mealType)}
                          size="small"
                        >
                          Add Meal
                        </Button>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </React.Fragment>
        ))}
      </Grid>

      {/* Add Meal Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{`Add ${selectedMealType} for ${selectedDay}`}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Controller
              name="recipeId"
              control={control}
              rules={{ required: 'Please select a recipe' }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.recipeId} sx={{ mt: 1 }}>
                  <InputLabel id="recipe-label">Recipe</InputLabel>
                  <Select
                    {...field}
                    labelId="recipe-label"
                    label="Recipe"
                  >
                    {MOCK_RECIPES.map((recipe) => (
                      <MenuItem key={recipe.id} value={recipe.id}>
                        {recipe.name} ({recipe.cookingTime} min)
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.recipeId && (
                    <Typography variant="caption" color="error">
                      {errors.recipeId.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained">
            Add to Plan
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MealPlannerPage;