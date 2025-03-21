import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
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

// Cuisine types
const CUISINE_TYPES = [
  'Italian',
  'Indian',
  'Chinese',
  'Mexican',
  'Greek',
  'Japanese',
  'Thai',
  'French',
  'American',
  'Other',
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

// Common units
const COMMON_UNITS = [
  'g',
  'kg',
  'ml',
  'l',
  'tsp',
  'tbsp',
  'cup',
  'oz',
  'lb',
  'piece',
  'slice',
  'clove',
  'to taste',
];

// Form values interface
interface RecipeFormValues {
  name: string;
  imageUrl: string;
  cookingTime: number;
  cuisineType: string;
  dietaryRestrictions: string[];
  preparationSteps: string;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
}

/**
 * Recipe editor page component
 */
const RecipeEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormValues>({
    defaultValues: {
      name: '',
      imageUrl: '',
      cookingTime: 30,
      cuisineType: '',
      dietaryRestrictions: [],
      preparationSteps: '',
      ingredients: [{ name: '', quantity: 0, unit: '' }],
    },
  });

  // Field array for ingredients
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  // Load recipe data for edit mode
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      // In a real app, this would fetch data from the API
      // For now, we'll just use the mock data
      setTimeout(() => {
        reset({
          name: MOCK_RECIPE.name,
          imageUrl: MOCK_RECIPE.imageUrl,
          cookingTime: MOCK_RECIPE.cookingTime,
          cuisineType: MOCK_RECIPE.cuisineType,
          dietaryRestrictions: MOCK_RECIPE.dietaryRestrictions,
          preparationSteps: MOCK_RECIPE.preparationSteps,
          ingredients: MOCK_RECIPE.ingredients,
        });
        setLoading(false);
      }, 500);
    }
  }, [isEditMode, id, reset]);

  // Handle form submission
  const onSubmit = async (data: RecipeFormValues) => {
    try {
      setError(null);
      setSuccess(null);
      
      // In a real app, this would send data to the API
      console.log('Submitting recipe:', data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess(isEditMode ? 'Recipe updated successfully!' : 'Recipe created successfully!');
      
      // Navigate back to recipe detail or list after a short delay
      setTimeout(() => {
        if (isEditMode) {
          navigate(`/recipes/${id}`);
        } else {
          navigate('/recipes');
        }
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save recipe');
    }
  };

  // Add new ingredient field
  const handleAddIngredient = () => {
    append({ name: '', quantity: 0, unit: '' });
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography>Loading...</Typography>
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
        <Typography color="text.primary">
          {isEditMode ? `Edit ${MOCK_RECIPE.name}` : 'New Recipe'}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          component={RouterLink}
          to={isEditMode ? `/recipes/${id}` : '/recipes'}
          startIcon={<ArrowBackIcon />}
        >
          {isEditMode ? 'Back to Recipe' : 'Back to Recipes'}
        </Button>
        <Typography variant="h4" component="h1">
          {isEditMode ? 'Edit Recipe' : 'Create New Recipe'}
        </Typography>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Recipe form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            {/* Basic information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Recipe name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Recipe Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Image URL"
                    fullWidth
                    placeholder="https://example.com/image.jpg"
                    error={!!errors.imageUrl}
                    helperText={errors.imageUrl?.message || 'Leave empty for a default image'}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="cookingTime"
                control={control}
                rules={{
                  required: 'Cooking time is required',
                  min: { value: 1, message: 'Minimum cooking time is 1 minute' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cooking Time (minutes)"
                    type="number"
                    fullWidth
                    error={!!errors.cookingTime}
                    helperText={errors.cookingTime?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="cuisineType"
                control={control}
                rules={{ required: 'Cuisine type is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.cuisineType}>
                    <InputLabel id="cuisine-type-label">Cuisine Type</InputLabel>
                    <Select
                      {...field}
                      labelId="cuisine-type-label"
                      label="Cuisine Type"
                    >
                      {CUISINE_TYPES.map((cuisine) => (
                        <MenuItem key={cuisine} value={cuisine}>
                          {cuisine}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.cuisineType && (
                      <FormHelperText>{errors.cuisineType.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="dietaryRestrictions"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="dietary-restrictions-label">Dietary Restrictions</InputLabel>
                    <Select
                      {...field}
                      labelId="dietary-restrictions-label"
                      label="Dietary Restrictions"
                      multiple
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {DIETARY_RESTRICTIONS.map((restriction) => (
                        <MenuItem key={restriction} value={restriction}>
                          {restriction}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Ingredients */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Ingredients</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddIngredient}
                  variant="outlined"
                  size="small"
                >
                  Add Ingredient
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Controller
                    name={`ingredients.${index}.name`}
                    control={control}
                    rules={{ required: 'Ingredient name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Ingredient"
                        fullWidth
                        error={!!errors.ingredients?.[index]?.name}
                        helperText={errors.ingredients?.[index]?.name?.message}
                      />
                    )}
                  />

                  <Controller
                    name={`ingredients.${index}.quantity`}
                    control={control}
                    rules={{ required: 'Quantity is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Quantity"
                        type="number"
                        sx={{ width: '120px' }}
                        error={!!errors.ingredients?.[index]?.quantity}
                        helperText={errors.ingredients?.[index]?.quantity?.message}
                      />
                    )}
                  />

                  <Controller
                    name={`ingredients.${index}.unit`}
                    control={control}
                    rules={{ required: 'Unit is required' }}
                    render={({ field }) => (
                      <FormControl sx={{ width: '120px' }} error={!!errors.ingredients?.[index]?.unit}>
                        <InputLabel id={`unit-label-${index}`}>Unit</InputLabel>
                        <Select
                          {...field}
                          labelId={`unit-label-${index}`}
                          label="Unit"
                        >
                          {COMMON_UNITS.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.ingredients?.[index]?.unit && (
                          <FormHelperText>{errors.ingredients?.[index]?.unit?.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />

                  <IconButton
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    color="error"
                    aria-label="Remove ingredient"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Preparation steps */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Preparation Steps
              </Typography>
              <Controller
                name="preparationSteps"
                control={control}
                rules={{ required: 'Preparation steps are required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Preparation Steps"
                    multiline
                    rows={10}
                    fullWidth
                    placeholder="Enter the preparation steps..."
                    error={!!errors.preparationSteps}
                    helperText={
                      errors.preparationSteps?.message ||
                      'Tip: Number each step and separate them with blank lines'
                    }
                  />
                )}
              />
            </Grid>

            {/* Submit button */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SaveIcon />}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? isEditMode
                    ? 'Updating...'
                    : 'Creating...'
                  : isEditMode
                  ? 'Update Recipe'
                  : 'Create Recipe'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default RecipeEditorPage;