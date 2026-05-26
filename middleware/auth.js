// middleware/auth.js
const jwt = require('jsonwebtoken');
const { Employee } = require('../models');

// ตรวจสอบ JWT
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // map payload -> req.user (รองรับหลายรูปแบบของ token payload)
    req.user = {
      id: decoded.id || decoded.userId || decoded.user_id || null,
      role: decoded.role || decoded.roles || decoded.userRole || null
    };

    // ถ้า token ถูก decode แต่ไม่มี id -> treat as unauthorized
    if (!req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: missing user id in token' });
    }

    next();
  } catch (err) {
    console.error('authenticate error:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ตรวจสอบ Role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.role === 'superadmin') {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
