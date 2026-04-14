import express from 'express'
import {
  getDashboard,
  getMyProperties,
  getAllDealers,
  getDealer,
  updateDealerStatus,
  deleteDealer,
} from '../controllers/dealerController.js'
import { protect, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(protect)

// Dealer routes
router.get('/dashboard', getDashboard)
router.get('/properties', getMyProperties)

// Admin only routes
router.get('/', isAdmin, getAllDealers)
router.get('/:id', isAdmin, getDealer)
router.put('/:id/status', isAdmin, updateDealerStatus)
router.delete('/:id', isAdmin, deleteDealer)

export default router
