import { Router } from 'express';
import {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  getCustomerProfile,
  getCustomerOrders,
  updateCustomerProfile,
} from '../controllers/customers';
import { requireAuth } from '../middleware/customerAuth';

const router = Router();

/**
 * @route   POST /api/customers/register
 * @desc    Register a new customer
 * @access  Public
 */
router.post('/register', registerCustomer);

/**
 * @route   POST /api/customers/login
 * @desc    Login customer and set cookie
 * @access  Public
 */
router.post('/login', loginCustomer);

/**
 * @route   POST /api/customers/logout
 * @desc    Logout customer and clear cookie
 * @access  Private
 */
router.post('/logout', requireAuth, logoutCustomer);

/**
 * @route   GET /api/customers/profile
 * @desc    Get current customer profile
 * @access  Private
 */
router.get('/profile', requireAuth, getCustomerProfile);

/**
 * @route   GET /api/customers/orders
 * @desc    Get customer order history
 * @access  Private
 */
router.get('/orders', requireAuth, getCustomerOrders);

/**
 * @route   PUT /api/customers/profile
 * @desc    Update customer profile
 * @access  Private
 */
router.put('/profile', requireAuth, updateCustomerProfile);

export default router;