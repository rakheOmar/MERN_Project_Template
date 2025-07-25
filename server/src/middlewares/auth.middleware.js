import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers['authorization']?.replace('Bearer', '').trim();

    if (!token) {
      throw new ApiError(401, 'Unauthorized', [], 'Access token is missing or invalid');
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select('-password -refreshToken');

    if (!user) {
      throw new ApiError(401, 'Unauthorized', [], 'User not found for the provided access token');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      401,
      'Unauthorized',
      [],
      error.message || 'Access token is invalid or expired'
    );
  }
});
