const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.get('/', authMiddleware, async (req, res) => {
  const todos = await prisma.todo.findMany({ where: { userId: req.user.userId } });
  res.json(todos);
});

router.post('/', authMiddleware, async (req, res) => {
  const todo = await prisma.todo.create({
    data: {
      title: req.body.title,
      userId: req.user.userId,
    },
  });
  res.json(todo);
});

module.exports = router;
