import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { useState } from 'react';

// Recipe interface
interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  cookingTime: number;
  cuisineType: string;
  dietaryRestrictions: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
}

/**
 * Recipe card component
 */
const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={RouterLink} to={`/recipes/${recipe.id}`}>
        <CardMedia
          component="img"
          height="160"
          image={recipe.imageUrl}
          alt={recipe.name}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="h2" noWrap>
            {recipe.name}
          </Typography>
          
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <TimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {recipe.cookingTime} min
            </Typography>
          </Stack>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {recipe.cuisineType}
          </Typography>
          
          {recipe.dietaryRestrictions.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {recipe.dietaryRestrictions.map((restriction) => (
                <Chip
                  key={restriction}
                  label={restriction}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              ))}
            </Stack>
          )}
        </CardContent>
      </CardActionArea>
      
      <CardActions sx={{ justifyContent: 'space-between', mt: 'auto' }}>
        <IconButton
          size="small"
          onClick={handleFavoriteClick}
          color="secondary"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        
        <IconButton
          size="small"
          component={RouterLink}
          to={`/recipes/edit/${recipe.id}`}
          aria-label="Edit recipe"
        >
          <EditIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;