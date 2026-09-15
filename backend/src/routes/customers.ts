import { Router } from 'express';
import {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  getCustomerProfile,
  getCustomerOrders,
  updateCustomerProfile,
  listCustomers,
  getCustomerById,
} from '../controllers/customers';
import { requireAuth } from '../middleware/customerAuth';
import { requireAuth as requireStaffAuth, requireAdmin } from '../middleware/auth';

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

/**
 * @route   GET /api/customers
 * @desc    List customers (admin)
 * @access  Private/Admin
 */
router.get('/', requireStaffAuth, requireAdmin, listCustomers);

/**
 * @route   GET /api/customers/:id
 * @desc    Customer detail with order history (admin). Declared after the
 *          fixed customer routes so /profile and /orders are never captured.
 * @access  Private/Admin
 */
router.get('/:id', requireStaffAuth, requireAdmin, getCustomerById);

export default router;