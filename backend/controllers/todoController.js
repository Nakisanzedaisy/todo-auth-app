const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getTodos = async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(todos);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        userId: req.user.id
      }
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findUnique({
      where: { id }
    });

    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (existingTodo.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        title,
        description
      }
    });

    res.json(todo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findUnique({
      where: { id }
    });

    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (existingTodo.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.todo.delete({
      where: { id }
    });

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};