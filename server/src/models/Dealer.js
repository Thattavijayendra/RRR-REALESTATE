import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const dealerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Dealer name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    company: {
      name: String,
      license: String,
      address: String,
    },
    role: {
      type: String,
      enum: ['admin', 'dealer', 'agent'],
      default: 'dealer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileImage: String,
    bio: String,
    socialLinks: {
      linkedin: String,
      twitter: String,
      instagram: String,
    },
    propertiesSold: {
      type: Number,
      default: 0,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: [
      {
        clientId: mongoose.Schema.Types.ObjectId,
        clientName: String,
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
)

// Hash password before saving
dealerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare password method
dealerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Get public profile
dealerSchema.methods.getPublicProfile = function () {
  const dealer = this.toObject()
  delete dealer.password
  delete dealer.__v
  return dealer
}

const Dealer = mongoose.model('Dealer', dealerSchema)

export default Dealer
