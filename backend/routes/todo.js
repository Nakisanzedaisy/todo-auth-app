const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.get('/', authenticate, async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: { userId: req.userId },
  });
  res.json(todos);
});

router.post('/', authenticate, async (req, res) => {
  const { title } = req.body;
  const todo = await prisma.todo.create({
    data: { title, userId: req.userId },
  });
  res.json(todo);
});

module.exports = router;
