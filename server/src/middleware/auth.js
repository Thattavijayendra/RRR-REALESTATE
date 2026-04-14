import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler.js'
import { Dealer } from '../models/index.js'

export const protect = async (req, res, next) => {
  let token

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new AppError('Not authorized to access this route', 401))
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get dealer from token
    req.dealer = await Dealer.findById(decoded.id)

    if (!req.dealer) {
      return next(new AppError('Dealer not found', 404))
    }

    if (!req.dealer.isActive) {
      return next(new AppError('Account is deactivated', 403))
    }

    next()
  } catch (error) {
    return next(new AppError('Not authorized to access this route', 401))
  }
}

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.dealer.role)) {
      return next(
        new AppError(`Role '${req.dealer.role}' is not authorized to access this route`, 403)
      )
    }
    next()
  }
}

// Dealer-only middleware
export const isDealer = (req, res, next) => {
  if (req.dealer.role !== 'dealer' && req.dealer.role !== 'admin') {
    return next(new AppError('Only dealers can access this route', 403))
  }
  next()
}

// Admin-only middleware
export const isAdmin = (req, res, next) => {
  if (req.dealer.role !== 'admin') {
    return next(new AppError('Only admins can access this route', 403))
  }
  next()
}
