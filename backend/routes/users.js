const express = require('express');
const { getAllUsers, deleteUser, getUserProfile } = require('../controllers/userController');
const { authenticateToken, requirePermission, requireRoles } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - Get all users (Admin and Super Admin only)
router.get('/', authenticateToken, requireRoles(['Admin', 'Super Admin']), getAllUsers);

// DELETE /api/users/:id - Delete a user (Admin and Super Admin only)
router.delete('/:id', authenticateToken, requirePermission('delete:user'), deleteUser);

// GET /api/users/profile - Get current user profile
router.get('/profile', authenticateToken, getUserProfile);

module.exports = router;