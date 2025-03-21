import { Router } from 'express';
import { body } from 'express-validator';
import passport from 'passport';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate-request';

const router = Router();
const authController = new AuthController();

// Register validation
const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required'),
];

// Login validation
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Refresh token validation
const refreshTokenValidation = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

// Routes
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.post('/refresh-token', refreshTokenValidation, validateRequest, authController.refreshToken);
router.post('/logout', authController.logout);

// Social login routes
router.get('/google', passport.authenticate('google', { session: false }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  authController.socialLoginCallback
);

router.get('/github', passport.authenticate('github', { session: false }));
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false }),
  authController.socialLoginCallback
);

router.get('/microsoft', passport.authenticate('microsoft', { session: false }));
router.get(
  '/microsoft/callback',
  passport.authenticate('microsoft', { session: false }),
  authController.socialLoginCallback
);

export default router;