import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

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
    throw new ApiError(
      'Please fill all the fields',
      404,
      [],
      'User registration failed due to missing fields'
    );
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(
      'User already exists',
      409,
      [],
      'User registration failed due to existing user'
    );
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(
      'Please upload both avatar and cover image',
      400,
      [],
      'User registration failed due to missing files'
    );
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

  if (!avatar) {
    throw new ApiError(
      'Please upload both avatar and cover image',
      400,
      [],
      'User registration failed due to missing files'
    );
  }

  const user = await User.create({
    fullname,
    email: email.toLowerCase(),
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage ? coverImage.url : null,
  });

  const createdUser = await User.findById(user._id).select('-password -refreshToken');

  if (!createdUser) {
    throw new ApiError(
      'User creation failed',
      500,
      [],
      'User registration failed due to server error'
    );
  }

  return res.status(201).json(new ApiResponse(200, createdUser, 'User registered successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(
      'Please fill atleast either Username or Email',
      404,
      [],
      'User registration failed due to missing fields'
    );
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new ApiError('User not found', 404, [], 'User login failed due to user not found');
  }

  const isPassValid = await user.isPasswordCorrect(password);
  if (!isPassValid) {
    throw new ApiError('Invalid password', 401, [], 'User login failed due to invalid password');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        'User logged in successfully'
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true });

  const options = { httpOnly: true, secure: true };

  res
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .status(200)
    .json(new ApiResponse(200, null, 'User logged out successfully'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incRefreshToken) {
    throw new ApiError(
      'Please provide refresh token',
      401,
      [],
      'Unauthorized access, refresh token missing'
    );
  }

  const decodedToken = jwt.verify(incRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError('User not found', 404, [], 'Unauthorized access, user not found');
  }

  if (user.refreshToken !== incRefreshToken) {
    throw new ApiError(
      'Invalid refresh token',
      401,
      [],
      'Unauthorized access, invalid refresh token'
    );
  }

  const options = { httpOnly: true, secure: true };
  const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', newRefreshToken, options)
    .json(
      new ApiResponse(200, { accessToken, newRefreshToken }, 'Access token refreshed successfully')
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError('User not found', 404, [], 'Change password failed, user not found');
  }

  const isPassCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPassCorrect) {
    throw new ApiError(
      'Incorrect old password',
      401,
      [],
      'Change password failed, incorrect old password'
    );
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, null, 'Password changed successfully'));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -refreshToken');
  return res.status(200).json(new ApiResponse(200, user, 'Current user fetched successfully'));
});

const updateCurrentUser = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!fullname || !email) {
    throw new ApiError(
      'Please provide fullname and email',
      400,
      [],
      'Update user failed due to missing fields'
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { fullname, email } },
    { new: true }
  ).select('-password -refreshToken');

  return res.status(200).json(new ApiResponse(200, user, 'Current user fetched successfully'));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) throw new ApiError(400, 'Avatar file is missing');

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) throw new ApiError(400, 'Error while uploading on avatar');

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select('-password');

  return res.status(200).json(new ApiResponse(200, user, 'Avatar image updated successfully'));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) throw new ApiError(400, 'Cover image file is missing');

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage.url) throw new ApiError(400, 'Error while uploading on avatar');

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { coverImage: coverImage.url } },
    { new: true }
  ).select('-password');

  return res.status(200).json(new ApiResponse(200, user, 'Cover image updated successfully'));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const username = req.params;
  if (!username) throw new ApiError(404, 'User not found');

  const channel = await User.aggregate([
    { $match: { username: username.toLowerCase() } },
    {
      $lookup: {
        from: 'subscriptions',
        localField: '_id',
        foreignField: 'channel',
        as: 'subscribers',
      },
    },
    {
      $lookup: {
        from: 'subscriptions',
        localField: '_id',
        foreignField: 'subscriber',
        as: 'subscribedTo',
      },
    },
    {
      $addFields: {
        subscribersCount: { $size: 'subscribers' },
        subscribedToCount: { $size: 'subscribedTo' },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, '$subscribers.subscriber'] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        avatar: 1,
        coverImage: 1,
        subscribersCount: 1,
        subscribedToCount: 1,
        isSubscribed: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) throw new ApiError(404, 'User not found');

  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], 'User channel fetched Successfully'));
});

const getUserWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(req.user._id) },
    },
    {
      $lookup: {
        from: 'videos',
        localField: 'watchHistory',
        foreignField: '_id',
        as: 'watchHistory',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'owner',
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $first: '$owner' },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, user[0].watchHistory, 'Watch history fetched succesfully'));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateCurrentUser,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getUserWatchHistory,
};
