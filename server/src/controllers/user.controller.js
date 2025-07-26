import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');

    const accessToken = await user.generateAuthToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch {
    throw new ApiError(500, 'Something went wrong');
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  if ([username, email, fullname, password].some((field) => !field || field.trim() === '')) {
    throw new ApiError('Please fill all the fields', 400);
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError('User already exists', 409);
  }

  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError('Please upload avatar', 400);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar?.url) {
    throw new ApiError('Failed to upload avatar', 500);
  }

  const user = new User({
    fullname,
    email: email.toLowerCase(),
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
  });

  await user.save();
  const createdUser = await User.findById(user._id).select('-password -refreshToken');

  return res.status(201).json(new ApiResponse(201, 'User registered successfully', createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError('Please provide username or email', 400);
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  const isPassValid = await user.isPasswordCorrect(password);
  if (!isPassValid) {
    throw new ApiError('Invalid password', 401);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(200, 'User logged in successfully', {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: undefined });

  const options = { httpOnly: true, secure: true };

  return res
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .status(200)
    .json(new ApiResponse(200, 'User logged out successfully'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incRefreshToken) {
    throw new ApiError('Refresh token missing', 401);
  }

  const decodedToken = jwt.verify(incRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decodedToken?._id);
  if (!user || user.refreshToken !== incRefreshToken) {
    throw new ApiError('Invalid refresh token', 401);
  }

  const options = { httpOnly: true, secure: true };
  const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', newRefreshToken, options)
    .json(
      new ApiResponse(200, 'Access token refreshed successfully', { accessToken, newRefreshToken })
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -refreshToken');
  return res.status(200).json(new ApiResponse(200, 'Current user fetched successfully', user));
});

const updateCurrentUser = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!fullname || !email) {
    throw new ApiError('Please provide fullname and email', 400);
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { fullname, email },
    { new: true }
  ).select('-password -refreshToken');

  return res.status(200).json(new ApiResponse(200, 'User updated successfully', user));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) throw new ApiError(400, 'Avatar file is missing');

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) throw new ApiError(400, 'Error uploading avatar');

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatar.url },
    { new: true }
  ).select('-password');

  return res.status(200).json(new ApiResponse(200, 'Avatar image updated successfully', user));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) throw new ApiError('User not found', 404);

  const isPassCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPassCorrect) throw new ApiError('Incorrect old password', 401);

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, 'Password changed successfully'));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateCurrentUser,
  updateUserAvatar,
  changeCurrentPassword,
};
