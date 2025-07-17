const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
  const { email, password, roleName } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const role = await prisma.role.findUnique({ where: { name: roleName } });

  if (!role) return res.status(400).json({ error: 'Invalid role' });

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      roleId: role.id,
    },
  });

  res.json(user);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id, role: user.role.name }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
