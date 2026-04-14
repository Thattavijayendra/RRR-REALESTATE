import express from 'express'
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getChanceProperties,
  getPropertyStats,
  togglePropertyStatus,
} from '../controllers/propertyController.js'
import { protect, isDealer } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.get('/', getProperties)
router.get('/stats', protect, getPropertyStats)
router.get('/featured/chance', getChanceProperties)
router.get('/:id', getProperty)

// Protected routes (Dealer only)
router.post('/', protect, isDealer, createProperty)
router.put('/:id', protect, isDealer, updateProperty)
router.patch('/:id/status', protect, isDealer, togglePropertyStatus)
router.delete('/:id', protect, isDealer, deleteProperty)

export default router
