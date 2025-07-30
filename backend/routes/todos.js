const express = require('express');
const { getTodos, createTodo, updateTodo, deleteTodo } = require('../controllers/todoController');
const { authenticateToken, requirePermission } = require('../middleware/auth');

const router = express.Router();

// GET /api/todos - Get all todos for authenticated user
router.get('/', authenticateToken, getTodos);

// POST /api/todos - Create a new todo
router.post('/', authenticateToken, requirePermission('create:todo'), createTodo);

// PUT /api/todos/:id - Update a todo
router.put('/:id', authenticateToken, requirePermission('create:todo'), updateTodo);

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', authenticateToken, requirePermission('create:todo'), deleteTodo);

module.exports = router;