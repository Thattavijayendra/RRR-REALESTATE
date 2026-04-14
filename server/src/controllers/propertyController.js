import { AppError } from '../middleware/errorHandler.js'
import { Property } from '../models/index.js'

// @desc    Get all properties with filtering
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res, next) => {
  try {
    const {
      type,
      status,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      beds,
      city,
      isChanceProperty,
      featured,
      sort,
      page = 1,
      limit = 9,
    } = req.query

    // Build query
    const query = {}

    if (type) {
      query.type = { $in: type.split(',') }
    }

    if (status) {
      query.status = { $in: status.split(',') }
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    if (minArea || maxArea) {
      query.area = {}
      if (minArea) query.area.$gte = Number(minArea)
      if (maxArea) query.area.$lte = Number(maxArea)
    }

    if (beds) {
      query.beds = { $gte: Number(beds) }
    }

    if (city) {
      query['location.city'] = new RegExp(city, 'i')
    }

    if (isChanceProperty !== undefined) {
      query.isChanceProperty = isChanceProperty === 'true'
    }

    if (featured !== undefined) {
      query.featured = featured === 'true'
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit)

    // Sorting
    let sortOption = { createdAt: -1 } // Default: newest first
    if (sort) {
      const sortOrder = sort.startsWith('-') ? -1 : 1
      const sortField = sort.replace('-', '')
      sortOption = { [sortField]: sortOrder }
    }

    const properties = await Property.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate('dealerId', 'name company email')

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

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
export const getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'dealerId',
      'name company email phone'
    )

    if (!property) {
      return next(new AppError('Property not found', 404))
    }

    res.status(200).json({
      success: true,
      data: property,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Dealer only)
export const createProperty = async (req, res, next) => {
  try {
    // Add dealer ID to request body
    req.body.dealerId = req.dealer._id

    const property = await Property.create(req.body)

    res.status(201).json({
      success: true,
      data: property,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Dealer only - owner or admin)
export const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id)

    if (!property) {
      return next(new AppError('Property not found', 404))
    }

    // Check ownership or admin
    if (
      property.dealerId.toString() !== req.dealer._id.toString() &&
      req.dealer.role !== 'admin'
    ) {
      return next(
        new AppError('Not authorized to update this property', 403)
      )
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: property,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Dealer only - owner or admin)
export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return next(new AppError('Property not found', 404))
    }

    // Check ownership or admin
    if (
      property.dealerId.toString() !== req.dealer._id.toString() &&
      req.dealer.role !== 'admin'
    ) {
      return next(
        new AppError('Not authorized to delete this property', 403)
      )
    }

    await property.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get chance properties (featured)
// @route   GET /api/properties/featured/chance
// @access  Public
export const getChanceProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({
      isChanceProperty: true,
      featured: true,
      status: { $in: ['For Sale', 'For Rent'] },
    })
      .sort({ createdAt: -1 })
      .limit(6)

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get property statistics
// @route   GET /api/properties/stats
// @access  Private (Admin/Dealer)
export const getPropertyStats = async (req, res, next) => {
  try {
    const stats = await Property.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: 1,
          avgPrice: { $round: ['$avgPrice', 0] },
          minPrice: 1,
          maxPrice: 1,
        },
      },
    ])

    const statusStats = await Property.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ])

    res.status(200).json({
      success: true,
      data: {
        byType: stats,
        byStatus: statusStats,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Toggle property status
// @route   PATCH /api/properties/:id/status
// @access  Private (Dealer only - owner or admin)
export const togglePropertyStatus = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return next(new AppError('Property not found', 404))
    }

    // Check ownership or admin
    if (
      property.dealerId.toString() !== req.dealer._id.toString() &&
      req.dealer.role !== 'admin'
    ) {
      return next(
        new AppError('Not authorized to update this property', 403)
      )
    }

    // Cycle through statuses: For Sale -> For Rent -> Pending -> Sold -> For Sale
    const statusCycle = {
      'For Sale': 'For Rent',
      'For Rent': 'Pending',
      'Pending': 'Sold',
      'Sold': 'For Sale',
    }

    const newStatus = statusCycle[property.status] || 'For Sale'

    property.status = newStatus
    await property.save()

    res.status(200).json({
      success: true,
      data: property,
    })
  } catch (error) {
    next(error)
  }
}
