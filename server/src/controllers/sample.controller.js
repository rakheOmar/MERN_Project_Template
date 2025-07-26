import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

const sample_function = asyncHandler(async (req, res) => {
  if (error) {
    throw new ApiError('sample_error', 400);
  }
  return res.status(200).json(new ApiResponse(200, 'sample_message'));
});

export { sample_function };
