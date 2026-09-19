import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { loginSchema, changePasswordSchema } from './auth.schema';
import { sendSuccess } from '../../utils/helpers';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = loginSchema.parse(req.body);
      const result = await authService.login(dto);

      // Set refresh token in httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      sendSuccess(res, {
        accessToken: result.accessToken,
        user: result.user,
      }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!token) {
        return res.status(401).json({ success: false, error: { message: 'Refresh token required' } });
      }
      const result = await authService.refreshToken(token);
      sendSuccess(res, result, 'Token refreshed');
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response) {
    res.clearCookie('refreshToken');
    sendSuccess(res, null, 'Logged out successfully');
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.user!.userId);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
      const result = await authService.changePassword(req.user!.userId, currentPassword, newPassword);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
