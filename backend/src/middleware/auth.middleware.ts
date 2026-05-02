import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (user) {
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req.user as any)?.role;
    if (!userRole || !roles.includes(userRole)) {
      res.status(403);
      return next(new Error(`Role: ${userRole} is not allowed to access this resource`));
    }
    next();
  };
};
