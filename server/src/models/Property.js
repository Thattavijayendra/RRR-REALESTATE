import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    type: {
      type: String,
      required: [true, 'Property type is required'],
      enum: ['House', 'Apartment', 'Penthouse', 'Villa', 'Land'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    area: {
      type: Number,
      required: [true, 'Area is required'],
      min: [0, 'Area cannot be negative'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['For Sale', 'For Rent', 'Sold', 'Pending'],
      default: 'For Sale',
    },
    beds: {
      type: Number,
      min: [0, 'Beds cannot be negative'],
    },
    baths: {
      type: Number,
      min: [0, 'Baths cannot be negative'],
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    images: [
      {
        url: { type: String, required: true },
        caption: String,
        isPrimary: { type: Boolean, default: false },
      },
    ],
    video: {
      url: String,
      provider: {
        type: String,
        enum: ['youtube', 'vimeo', 'direct'],
      },
    },
    amenities: [String],
    isChanceProperty: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    yearBuilt: Number,
    parkingSpaces: Number,
    hasGarage: Boolean,
    hasPool: Boolean,
    hasGarden: Boolean,
    hasElevator: Boolean,
    isFurnished: Boolean,
    petFriendly: Boolean,
    dealerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dealer',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Indexes for filtering
propertySchema.index({ type: 1, status: 1, price: 1 })
propertySchema.index({ 'location.city': 1 })
propertySchema.index({ isChanceProperty: 1, featured: 1 })

// Virtual for formatted price
propertySchema.virtual('formattedPrice').get(function () {
  if (this.price >= 1000000) {
    return `$${(this.price / 1000000).toFixed(1)}M`
  }
  return `$${(this.price / 1000).toFixed(0)}K`
})

const Property = mongoose.model('Property', propertySchema)

export default Property
