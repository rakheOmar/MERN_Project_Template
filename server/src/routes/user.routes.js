import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateCurrentUser,
  updateUserAvatar,
} from '../controllers/user.controller.js';

import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public Routes
router.post('/register', upload.single('avatar'), registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshAccessToken);

// Authenticated Routes
router.post('/logout', verifyJWT, logoutUser);
router.post('/change-password', verifyJWT, changeCurrentPassword);
router.get('/me', verifyJWT, getCurrentUser);
router.patch('/me', verifyJWT, updateCurrentUser);
router.patch('/me/avatar', verifyJWT, upload.single('avatar'), updateUserAvatar);

export default router;
