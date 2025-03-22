import { Router } from 'express';
// import { InventoryController } from '../controllers/inventory.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
// const inventoryController = new InventoryController();

// Get user's inventory
router.get('/', authenticate(), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This endpoint will return the user\'s inventory',
    data: [],
  });
});

// Add ingredient to inventory
router.post('/', authenticate(), (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'This endpoint will add an ingredient to the user\'s inventory',
    data: null,
  });
});

// Update ingredient in inventory
router.put('/:id', authenticate(), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `This endpoint will update ingredient with ID: ${req.params.id} in the user's inventory`,
    data: null,
  });
});

// Remove ingredient from inventory
router.delete('/:id', authenticate(), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `This endpoint will remove ingredient with ID: ${req.params.id} from the user's inventory`,
    data: null,
  });
});

export default router;