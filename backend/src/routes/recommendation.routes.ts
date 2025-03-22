import { Router } from 'express';
// import { RecommendationController } from '../controllers/recommendation.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
// const recommendationController = new RecommendationController();

// Get recipe recommendations
router.get('/', authenticate(), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This endpoint will return recipe recommendations',
    data: [],
  });
});

// Get recommendations based on available ingredients
router.get('/by-ingredients', authenticate(), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This endpoint will return recommendations based on available ingredients',
    data: [],
  });
});

// Get recommendations based on cuisine type
router.get('/by-cuisine/:cuisineType', authenticate(), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `This endpoint will return recommendations for cuisine type: ${req.params.cuisineType}`,
    data: [],
  });
});

// Get recommendations based on dietary restrictions
router.get('/by-dietary', authenticate(), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This endpoint will return recommendations based on dietary restrictions',
    data: [],
  });
});

// Get random recommendations
router.get('/random', authenticate(), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This endpoint will return random recipe recommendations',
    data: [],
  });
});

export default router;