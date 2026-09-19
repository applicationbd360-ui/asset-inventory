import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const userController = {
  getUsers: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.user.findMany({
        include: {
          role: { select: { id: true, name: true, displayName: true } },
          department: { select: { id: true, name: true } }
        },
        orderBy: { id: 'desc' }
      });

      // Exclude password hashes
      const safeUsers = users.map(user => {
        const { passwordHash, ...safeUser } = user;
        return safeUser;
      });

      res.json({ success: true, data: safeUsers });
    } catch (error) {
      next(error);
    }
  },

  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { employeeCode, name, email, password, roleId, departmentId, isActive } = req.body;
      
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ success: false, error: { message: 'Email already exists' } });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password || 'Welcome123!', salt);

      const user = await prisma.user.create({
        data: {
          employeeCode,
          name,
          email,
          passwordHash,
          roleId: parseInt(roleId),
          departmentId: departmentId ? parseInt(departmentId) : null,
          isActive: isActive !== undefined ? isActive : true
        },
        include: {
          role: true,
          department: true
        }
      });
      
      const { passwordHash: _hash, ...safeUser } = user;
      res.status(201).json({ success: true, data: safeUser });
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { employeeCode, name, email, roleId, departmentId, isActive } = req.body;
      
      const user = await prisma.user.update({
        where: { id: parseInt(id as string) },
        data: {
          ...(employeeCode !== undefined && { employeeCode }),
          ...(name && { name }),
          ...(email && { email }),
          ...(roleId && { roleId: parseInt(roleId) }),
          ...(departmentId !== undefined && { departmentId: departmentId ? parseInt(departmentId) : null }),
          ...(isActive !== undefined && { isActive })
        },
        include: {
          role: true,
          department: true
        }
      });
      
      const { passwordHash, ...safeUser } = user;
      res.json({ success: true, data: safeUser });
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      if (!newPassword) {
        return res.status(400).json({ success: false, error: { message: 'New password is required' } });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      await prisma.user.update({
        where: { id: parseInt(id as string) },
        data: { passwordHash }
      });
      
      res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      // Instead of hard delete, maybe just deactivate? Let's hard delete for now if requested, 
      // but deactivate if linked to many records. Actually, let's just deactivate.
      await prisma.user.update({
        where: { id: parseInt(id as string) },
        data: { isActive: false }
      });
      
      res.json({ success: true, message: 'User deactivated successfully' });
    } catch (error) {
      next(error);
    }
  }
};
