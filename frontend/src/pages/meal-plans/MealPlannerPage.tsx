import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { recipeService } from '../../services/apiService';
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
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBackIos as PrevIcon,
  ArrowForwardIos as NextIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Restaurant as MealTypeIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';

// Recipe interface
interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  cookingTime: number;
  cuisineType: string;
  suitableMealTypes: string[];
  dietaryRestrictions?: string[];
  preparationSteps?: string;
  ingredients?: any[];
  isPublic?: boolean;
}

// Meal types
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

// Meal type options for selection
const MEAL_TYPE_OPTIONS = [
  { value: 'Breakfast', label: 'Breakfast' },
  { value: 'Lunch', label: 'Lunch' },
  { value: 'Dinner', label: 'Dinner' },
  { value: 'Snack', label: 'Snack' },
];

// Days per week options
const DAYS_PER_WEEK = [1, 2, 3, 4, 5, 6, 7];

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
  const { accessToken } = useAuth();
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>(['Lunch', 'Dinner']); // Default to Lunch and Dinner
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5); // Default to 5 days

  // Fetch recipes from API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const recipesData = await recipeService.getAllRecipes(accessToken);
        
        // Transform the data to match the expected format
        const transformedRecipes = recipesData.map(recipe => ({
          ...recipe,
          // Transform suitableMealTypes from string to array if needed
          suitableMealTypes: typeof recipe.suitableMealTypes === 'string'
            ? recipe.suitableMealTypes.split(',')
            : recipe.suitableMealTypes || [],
          // Transform dietaryRestrictions from objects to strings if needed
          dietaryRestrictions: Array.isArray(recipe.dietaryRestrictions)
            ? recipe.dietaryRestrictions.map((r: any) => typeof r === 'string' ? r : r.restriction)
            : []
        }));
        
        setRecipes(transformedRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('Failed to load recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, [accessToken]);

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
    
    // Create a new meal plan for the current week
    // In a real app, this would fetch from the API
    const newMealPlan: MealPlan = {
      id: Date.now().toString(),
      startDate,
      endDate,
      meals: [],
    };
    
    setMealPlan(newMealPlan);
    
    // If we have recipes, generate a meal plan
    if (recipes.length > 0 && !loading) {
      setTimeout(() => {
        generateMealPlan();
      }, 500);
    }
  }, [currentWeek, recipes.length, loading]);

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

  // Get recipe by ID
  const getRecipeById = (recipeId: string) => {
    return recipes.find((recipe) => recipe.id === recipeId);
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
    
    // Get the days to include based on daysPerWeek
    const daysToInclude = DAYS_OF_WEEK.slice(0, daysPerWeek);
    
    // Generate random meals for each selected day and meal type
    daysToInclude.forEach((day) => {
      // Use the selected meal types
      selectedMealTypes.forEach((mealType) => {
        // Filter recipes suitable for this meal type
        const suitableRecipes = recipes.filter(recipe =>
          recipe.suitableMealTypes.includes(mealType)
        );
        
        if (suitableRecipes.length > 0) {
          // Randomly select a recipe from suitable ones
          const randomRecipeIndex = Math.floor(Math.random() * suitableRecipes.length);
          const randomRecipe = suitableRecipes[randomRecipeIndex];
          
          newMealPlan.meals.push({
            id: `${day}-${mealType}-${Date.now()}`,
            day,
            mealType,
            recipeId: randomRecipe.id,
          });
        }
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

        {/* Meal Plan Generation Options */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Meal Plan Options
          </Typography>
          <Grid container spacing={3}>
            {/* Meal Types Selection */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MealTypeIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="subtitle1">Meal Types</Typography>
              </Box>
              <FormGroup row>
                {MEAL_TYPE_OPTIONS.map((mealType) => (
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

            {/* Days Per Week Selection */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="subtitle1">Days Per Week</Typography>
              </Box>
              <FormControl fullWidth>
                <InputLabel id="days-per-week-label">Days</InputLabel>
                <Select
                  labelId="days-per-week-label"
                  value={daysPerWeek}
                  label="Days"
                  onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                >
                  {DAYS_PER_WEEK.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day} {day === 1 ? 'day' : 'days'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

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
                    {recipes.map((recipe) => (
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