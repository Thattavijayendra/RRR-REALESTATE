import jwt from 'jsonwebtoken'
import { AppError } from '../middleware/errorHandler.js'
import { Dealer } from '../models/index.js'

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  })
}

// @desc    Register new dealer
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, company } = req.body

    // Check if dealer exists
    const dealerExists = await Dealer.findOne({ email })
    if (dealerExists) {
      return next(new AppError('Email already registered', 400))
    }

    // Create dealer
    const dealer = await Dealer.create({
      name,
      email,
      password,
      phone,
      company,
    })

    // Generate token
    const token = generateToken(dealer._id)

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        dealer: dealer.getPublicProfile(),
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login dealer
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate email & password
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400))
    }

    // Check for dealer (include password for comparison)
    const dealer = await Dealer.findOne({ email }).select('+password')

    if (!dealer) {
      return next(new AppError('Invalid credentials', 401))
    }

    // Check if dealer is active
    if (!dealer.isActive) {
      return next(new AppError('Account is deactivated', 403))
    }

    // Check if password matches
    const isMatch = await dealer.comparePassword(password)

    if (!isMatch) {
      return next(new AppError('Invalid credentials', 401))
    }

    // Generate token
    const token = generateToken(dealer._id)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        dealer: dealer.getPublicProfile(),
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current logged in dealer
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const dealer = await Dealer.findById(req.dealer._id)

    res.status(200).json({
      success: true,
      data: dealer.getPublicProfile(),
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update dealer profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      bio: req.body.bio,
      company: req.body.company,
      socialLinks: req.body.socialLinks,
      profileImage: req.body.profileImage,
    }

    const dealer = await Dealer.findByIdAndUpdate(
      req.dealer._id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      }
    )

    res.status(200).json({
      success: true,
      data: dealer.getPublicProfile(),
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return next(new AppError('Please provide current and new password', 400))
    }

    const dealer = await Dealer.findById(req.dealer._id).select('+password')

    // Check current password
    const isMatch = await dealer.comparePassword(currentPassword)

    if (!isMatch) {
      return next(new AppError('Current password is incorrect', 401))
    }

    dealer.password = newPassword
    await dealer.save()

    // Generate new token
    const token = generateToken(dealer._id)

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      data: { token },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Logout dealer
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  })
}
