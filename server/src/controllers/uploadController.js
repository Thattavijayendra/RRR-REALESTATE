import { AppError } from '../middleware/errorHandler.js'
import cloudinary from '../config/cloudinary.js'

const uploadBufferToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
    stream.end(buffer)
  })
}

export const uploadImages = async (req, res, next) => {
  try {
    const files = req.files || []

    if (files.length === 0) {
      return next(new AppError('Please upload at least one image', 400))
    }

    if (files.length > 10) {
      return next(new AppError('You may upload a maximum of 10 images', 400))
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 10 * 1024 * 1024 // 10 MB

    const uploads = await Promise.all(
      files.map(async (file) => {
        if (!allowedTypes.includes(file.mimetype)) {
          throw new AppError('Only JPG, PNG, WEBP, and GIF images are allowed', 400)
        }
        if (file.size > maxSize) {
          throw new AppError('Each image must be smaller than 10 MB', 400)
        }

        const result = await uploadBufferToCloudinary(file.buffer, {
          folder: 'luxe-estates/properties',
          resource_type: 'image',
          transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
        })

        return {
          url: result.secure_url,
          public_id: result.public_id,
        }
      })
    )

    res.status(200).json({
      success: true,
      data: uploads,
    })
  } catch (error) {
    next(error)
  }
}

export const uploadVideo = async (req, res, next) => {
  try {
    const file = req.file

    if (!file) {
      return next(new AppError('Please upload a video file', 400))
    }

    const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
    const maxSize = 50 * 1024 * 1024 // 50 MB

    if (!allowedVideoTypes.includes(file.mimetype)) {
      return next(new AppError('Only MP4, MOV, AVI, and MKV video files are allowed', 400))
    }

    if (file.size > maxSize) {
      return next(new AppError('Video must be smaller than 50 MB', 400))
    }

    const result = await uploadBufferToCloudinary(file.buffer, {
      folder: 'luxe-estates/videos',
      resource_type: 'video',
      chunk_size: 6000000,
      transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
    })

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    })
  } catch (error) {
    next(error)
  }
}
