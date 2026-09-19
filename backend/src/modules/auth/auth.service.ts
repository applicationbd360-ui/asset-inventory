import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';
import { config } from '../../config';
import { AppError, NotFoundError } from '../../utils/AppError';
import { AuthPayload } from '../../middleware/auth.middleware';
import { LoginDto } from './auth.schema';

export class AuthService {
  // ── Login ───────────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await prisma.user.findFirst({
      where: { email: dto.email.toLowerCase(), isActive: true },
      include: { role: true, department: true },
    });

    if (!user) throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload: AuthPayload = {
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role.name,
      permissions: user.role.permissions as string[],
    };

    const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiresIn as any,
    });

    const refreshToken = jwt.sign(
      { userId: user.id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn as any }
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        employeeCode: user.employeeCode,
        role: { id: user.role.id, name: user.role.name, displayName: user.role.displayName },
        department: user.department ? { id: user.department.id, name: user.department.name } : null,
        permissions: user.role.permissions,
      },
    };
  }

  // ── Refresh Token ───────────────────────────────────────────
  async refreshToken(token: string) {
    try {
      const payload = jwt.verify(token, config.jwt.refreshSecret) as { userId: number };

      const user = await prisma.user.findFirst({
        where: { id: payload.userId, isActive: true },
        include: { role: true },
      });

      if (!user) throw new AppError('User not found', 401);

      const accessPayload: AuthPayload = {
        userId: user.id,
        email: user.email,
        roleId: user.roleId,
        roleName: user.role.name,
        permissions: user.role.permissions as string[],
      };

      const accessToken = jwt.sign(accessPayload, config.jwt.accessSecret, {
        expiresIn: config.jwt.accessExpiresIn as any,
      });

      return { accessToken };
    } catch {
      throw new AppError('Invalid refresh token', 401, 'INVALID_TOKEN');
    }
  }

  // ── Get Current User ────────────────────────────────────────
  async getMe(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true, department: { include: { costCenter: true } } },
    });

    if (!user) throw new NotFoundError('User');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      employeeCode: user.employeeCode,
      role: { id: user.role.id, name: user.role.name, displayName: user.role.displayName },
      department: user.department,
      permissions: user.role.permissions,
      lastLoginAt: user.lastLoginAt,
    };
  }

  // ── Change Password ─────────────────────────────────────────
  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User');

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) throw new AppError('Current password is incorrect', 400, 'WRONG_PASSWORD');

    const hash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash: hash } });

    return { message: 'Password changed successfully' };
  }
}

export const authService = new AuthService();
