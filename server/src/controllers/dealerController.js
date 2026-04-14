import { AppError } from '../middleware/errorHandler.js'
import { Dealer, Property } from '../models/index.js'

// @desc    Get dealer dashboard stats
// @route   GET /api/dealer/dashboard
// @access  Private (Dealer only)
export const getDashboard = async (req, res, next) => {
  try {
    const dealerId = req.dealer._id

    // Get dealer's properties count by status
    const propertiesStats = await Property.aggregate([
      { $match: { dealerId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ])

    // Get total properties
    const totalProperties = await Property.countDocuments({ dealerId })

    // Get recent properties
    const recentProperties = await Property.find({ dealerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title price status type images')

    // Format stats
    const stats = {
      total: totalProperties,
      forSale: 0,
      forRent: 0,
      sold: 0,
      pending: 0,
    }

    propertiesStats.forEach((stat) => {
      const key = stat._id.replace(' ', '').toLowerCase()
      stats[key] = stat.count
    })

    res.status(200).json({
      success: true,
      data: {
        stats,
        recentProperties,
        dealer: req.dealer.getPublicProfile(),
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get dealer's properties
// @route   GET /api/dealer/properties
// @access  Private (Dealer only)
export const getMyProperties = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query

    const query = { dealerId: req.dealer._id }
    if (status) {
      query.status = status
    }

    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))

    const total = await Property.countDocuments(query)

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: properties,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all dealers (Admin only)
// @route   GET /api/dealer
// @access  Private (Admin only)
export const getAllDealers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isActive, role } = req.query

    const query = {}
    if (isActive !== undefined) {
      query.isActive = isActive === 'true'
    }
    if (role) {
      query.role = role
    }

    const dealers = await Dealer.find(query)
      .select('-password')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))

    const total = await Dealer.countDocuments(query)

    res.status(200).json({
      success: true,
      count: dealers.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: dealers,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single dealer
// @route   GET /api/dealer/:id
// @access  Private (Admin only)
export const getDealer = async (req, res, next) => {
  try {
    const dealer = await Dealer.findById(req.params.id).select('-password')

    if (!dealer) {
      return next(new AppError('Dealer not found', 404))
    }

    // Get dealer's properties count
    const propertiesCount = await Property.countDocuments({
      dealerId: req.params.id,
    })

    res.status(200).json({
      success: true,
      data: {
        ...dealer.toObject(),
        propertiesCount,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update dealer status (Admin only)
// @route   PUT /api/dealer/:id/status
// @access  Private (Admin only)
export const updateDealerStatus = async (req, res, next) => {
  try {
    const { isActive, isVerified } = req.body

    const dealer = await Dealer.findByIdAndUpdate(
      req.params.id,
      { isActive, isVerified },
      { new: true, runValidators: true }
    ).select('-password')

    if (!dealer) {
      return next(new AppError('Dealer not found', 404))
    }

    res.status(200).json({
      success: true,
      message: 'Dealer status updated',
      data: dealer,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete dealer (Admin only)
// @route   DELETE /api/dealer/:id
// @access  Private (Admin only)
export const deleteDealer = async (req, res, next) => {
  try {
    const dealer = await Dealer.findById(req.params.id)

    if (!dealer) {
      return next(new AppError('Dealer not found', 404))
    }

    // Prevent self-deletion
    if (dealer._id.toString() === req.dealer._id.toString()) {
      return next(new AppError('Cannot delete your own account', 400))
    }

    await dealer.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Dealer deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}
