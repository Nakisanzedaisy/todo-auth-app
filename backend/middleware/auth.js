const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

const requirePermission = (permissionName) => {
  return (req, res, next) => {
    const userPermissions = req.user.role.permissions.map(rp => rp.permission.name);
    
    if (!userPermissions.includes(permissionName)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

const requireRoles = (roleNames) => {
  return (req, res, next) => {
    if (!roleNames.includes(req.user.role.name)) {
      return res.status(403).json({ error: 'Insufficient role' });
    }
    
    next();
  };
};

module.exports = {
  authenticateToken,
  requirePermission,
  requireRoles
};