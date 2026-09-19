import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';

export interface AuthPayload {
  userId: number;
  email: string;
  roleId: number;
  roleName: string;
  permissions: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

// ── Authenticate ─────────────────────────────────────────────
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No authentication token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, config.jwt.accessSecret) as AuthPayload;

    // Verify user still exists and is active
    const user = await prisma.user.findFirst({
      where: { id: payload.userId, isActive: true },
      include: { role: true },
    });

    if (!user) throw new AppError('User not found or inactive', 401);

    req.user = {
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role.name,
      permissions: user.role.permissions as string[],
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid or expired token', 401));
    } else {
      next(error);
    }
  }
};

// ── Authorize (Permission Check) ─────────────────────────────
export const authorize = (permissions: string[] | string) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Not authenticated', 401));

    const userPerms = req.user.permissions;
    const isSuperAdmin = userPerms.includes('*');

    if (isSuperAdmin) return next();

    const requiredPerms = Array.isArray(permissions) ? permissions : [permissions];
    const hasPermission = requiredPerms.some((perm) => userPerms.includes(perm));
    if (!hasPermission) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

// ── Optional Auth (for public + private routes) ───────────────
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return next();

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, config.jwt.accessSecret) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    next();
  }
};
