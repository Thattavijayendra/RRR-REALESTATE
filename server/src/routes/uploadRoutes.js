import express from 'express'
import multer from 'multer'
import { protect, isDealer } from '../middleware/auth.js'
import { uploadImages, uploadVideo } from '../controllers/uploadController.js'

const router = express.Router()
const storage = multer.memoryStorage()

const imageUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})

const videoUpload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true)
    } else {
      cb(new Error('Only video files are allowed'))
    }
  },
})

router.post('/images', protect, isDealer, imageUpload.array('images', 10), uploadImages)
router.post('/video', protect, isDealer, videoUpload.single('video'), uploadVideo)

export default router
