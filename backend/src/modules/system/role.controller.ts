import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const roleController = {
  getRoles: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const roles = await prisma.role.findMany({
        include: {
          _count: {
            select: { users: true }
          }
        },
        orderBy: { id: 'asc' }
      });
      res.json({ success: true, data: roles });
    } catch (error) {
      next(error);
    }
  },

  createRole: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, displayName, permissions, isActive } = req.body;
      
      const role = await prisma.role.create({
        data: {
          name,
          displayName,
          permissions: permissions || [],
          isActive: isActive !== undefined ? isActive : true
        }
      });
      
      res.status(201).json({ success: true, data: role });
    } catch (error) {
      next(error);
    }
  },

  updateRole: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, displayName, permissions, isActive } = req.body;
      
      const role = await prisma.role.update({
        where: { id: parseInt(id as string) },
        data: {
          ...(name && { name }),
          ...(displayName && { displayName }),
          ...(permissions && { permissions }),
          ...(isActive !== undefined && { isActive }),
        }
      });
      
      res.json({ success: true, data: role });
    } catch (error) {
      next(error);
    }
  },

  deleteRole: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      // Prevent deleting if users are attached
      const usersCount = await prisma.user.count({ where: { roleId: parseInt(id as string) } });
      if (usersCount > 0) {
        return res.status(400).json({ 
          success: false, 
          error: { message: 'Cannot delete role assigned to users.' } 
        });
      }

      await prisma.role.delete({ where: { id: parseInt(id as string) } });
      res.json({ success: true, message: 'Role deleted successfully.' });
    } catch (error) {
      next(error);
    }
  }
};
