/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid ObjectId, false otherwise
 */
export function isValidObjectId(id) {
  if (!id || id === 'undefined' || id === 'null') {
    return false;
  }
  
  // Check if it's a 24 character hex string
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Validates ObjectId and returns error response if invalid
 * @param {string} id - The ID to validate
 * @param {string} fieldName - Name of the field being validated (for error message)
 * @returns {object|null} - Error response object or null if valid
 */
export function validateObjectId(id, fieldName = 'ID') {
  if (!id || id === 'undefined' || id === 'null') {
    return {
      status: 400,
      message: `${fieldName} is required`
    };
  }
  
  if (!isValidObjectId(id)) {
    return {
      status: 400,
      message: `Invalid ${fieldName} format`
    };
  }
  
  return null;
}

/**
 * Middleware to validate ObjectId parameters
 * @param {string} paramName - Name of the parameter to validate
 * @returns {function} - Express middleware function
 */
export function validateObjectIdParam(paramName) {
  return (req, res, next) => {
    const id = req.params[paramName];
    const error = validateObjectId(id, paramName);
    
    if (error) {
      return res.status(error.status).json({ message: error.message });
    }
    
    next();
  };
}
