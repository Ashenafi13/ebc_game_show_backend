
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  // Check if the Authorization header is present
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is missing' });
  }

  // Check if the header starts with 'Bearer '
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Invalid Authorization header format' });
  }

  // Extract the token
  const token = authHeader.replace('Bearer ', '');

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Handle invalid token errors
    res.status(401).json({ error: 'Unauthorized' });
  }
};


module.exports = authMiddleware;
