import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Eye, EyeOff, Loader2, AlertCircle, Box, 
  MapPin, ClipboardCheck, QrCode, Factory, 
  ShieldCheck, RefreshCw, BarChart2, Mail, Lock
} from 'lucide-react';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/auth.store';
import './LoginPage.css';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'admin@assetiq.com', password: 'Admin@123' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setServerError('');
      const result = await authApi.login(data);
      setUser(result.user, result.accessToken);
      navigate('/dashboard');
    } catch (err: any) {
      setServerError(
        err.response?.data?.error?.message || 'Login failed. Please try again.'
      );
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        
        {/* Left Panel */}
        <div className="login-left">
          <div className="login-brand-top">
            <div className="brand-logo-icon">
              <Box size={32} />
            </div>
            <div className="brand-text-wrap">
              <h1 className="brand-title">AssetSync</h1>
              <span className="brand-tagline">Right Asset, Right Place, Right Time</span>
            </div>
          </div>

          <div className="login-hero-text">
            <h2>Smart Asset Management <span>Simplified.</span></h2>
            <p>Track. Manage. Optimize.<br/>All your assets. All in sync.</p>
          </div>

          <div className="login-mockup">
            <div className="mockup-floating-icon icon-1"><MapPin size={20} /></div>
            <div className="mockup-floating-icon icon-2"><ClipboardCheck size={20} /></div>
            <div className="mockup-floating-icon icon-3"><QrCode size={20} /></div>
            <div className="mockup-floating-icon icon-4"><Factory size={20} /></div>
            
            <div className="mockup-laptop">
              <div className="laptop-screen">
                <div className="laptop-ui-header">
                  <div className="ui-dot"></div><div className="ui-dot"></div><div className="ui-dot"></div>
                </div>
                <div className="laptop-ui-body">
                  <div className="ui-sidebar"></div>
                  <div className="ui-content">
                    <div className="ui-cards">
                      <div className="ui-card"></div><div className="ui-card"></div><div className="ui-card"></div><div className="ui-card"></div>
                    </div>
                    <div className="ui-charts">
                      <div className="ui-chart-large"></div>
                      <div className="ui-chart-pie"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="laptop-base"></div>
            </div>
          </div>

          <div className="login-features">
            <div className="feature-item">
              <ShieldCheck size={28} className="feature-icon" />
              <h4>Secure</h4>
              <p>Enterprise Grade<br/>Security</p>
            </div>
            <div className="feature-item">
              <RefreshCw size={28} className="feature-icon" />
              <h4>Real-time Sync</h4>
              <p>Always Up-to-date<br/>Information</p>
            </div>
            <div className="feature-item">
              <BarChart2 size={28} className="feature-icon" />
              <h4>Data Driven</h4>
              <p>Insights for Better<br/>Decisions</p>
            </div>
          </div>

          <div className="login-footer">
            &copy; 2024 AssetSync. All rights reserved.
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right">
          <div className="login-form-card">
            
            <div className="login-form-brand-mobile">
               <div className="brand-logo-icon">
                <Box size={36} />
              </div>
              <div className="brand-text-wrap">
                <h1 className="brand-title">AssetSync</h1>
                <span className="brand-tagline">Right Asset, Right Place, Right Time</span>
              </div>
            </div>

            <div className="login-form-header">
              <h2>Welcome back!</h2>
              <p>Please sign in to continue</p>
            </div>

            {serverError && (
              <div className="login-error">
                <AlertCircle size={14} />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={errors.email ? 'input-error' : ''}
                    {...register('email')}
                  />
                </div>
                {errors.email && <span className="form-error">{errors.email.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={errors.password ? 'input-error' : ''}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <span className="form-error">{errors.password.message}</span>}
              </div>

              <div className="form-options">
                <label className="checkbox-wrap">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-pass">Forgot Password?</a>
              </div>

              <button type="submit" className="btn-signin" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 size={18} className="animate-spin" /> Signing In...</>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="social-login">
              <button className="btn-social">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="btn-social">
                <svg width="18" height="18" viewBox="0 0 21 21">
                  <path fill="#f25022" d="M1 1h9v9H1z"/><path fill="#00a4ef" d="M1 11h9v9H1z"/><path fill="#7fba00" d="M11 1h9v9h-9z"/><path fill="#ffb900" d="M11 11h9v9h-9z"/>
                </svg>
                Microsoft
              </button>
            </div>

            <div className="login-form-footer">
              Don't have an account? <a href="#">Contact Administrator</a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
