const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'No authorization header provided',
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'No token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    console.log('🔑 Token decoded:', {
      userId: decoded.userId,
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      allFields: Object.keys(decoded)
    });
    
    // Attach user info to request
    // Support both userId (alumni) and studentId (students)
    // Also support 'id' field for backward compatibility
    req.user = {
      userId: decoded.userId || decoded.id,
      studentId: decoded.studentId,
      id: decoded.userId || decoded.id, // For backward compatibility
      email: decoded.email,
      role: decoded.role,
      type: decoded.type, // 'student' or undefined (alumni)
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        error: 'Token verification failed',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        error: 'Please login again',
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: 'An error occurred during authentication',
    });
  }
};

/**
 * Middleware to check if user owns the resource
 * Must be used after authenticate middleware
 * Supports both integer IDs (alumni/users) and UUIDs (students)
 */
const authorizeOwner = (req, res, next) => {
  const resourceId = req.params.id || req.params.userId || req.params.studentId;
  const authenticatedUserId = req.user?.userId || req.user?.studentId || req.user?.id;

  console.log('🔐 authorizeOwner check:', {
    resourceId,
    authenticatedUserId,
    decodedUser: req.user,
    params: req.params
  });

  if (!authenticatedUserId) {
    console.error('❌ No authenticated user ID found');
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      error: 'No user ID found in token',
    });
  }

  // Handle both integer IDs and UUIDs (strings)
  // Convert to string for comparison to handle both cases
  const resourceIdStr = String(resourceId);
  const authenticatedIdStr = String(authenticatedUserId);

  if (resourceIdStr !== authenticatedIdStr) {
    console.error('❌ Authorization failed:', {
      resourceId: resourceIdStr,
      authenticatedId: authenticatedIdStr,
      match: resourceIdStr === authenticatedIdStr
    });
    return res.status(403).json({
      success: false,
      message: 'Forbidden',
      error: `You can only modify your own account. Resource ID: ${resourceIdStr}, Your ID: ${authenticatedIdStr}`,
    });
  }

  console.log('✅ Authorization passed');
  next();
};

module.exports = {
  authenticate,
  authorizeOwner,
};

