import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Signup() {
  const [step, setStep] = useState('signup'); // 'signup' | 'otp'
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthColor = ['', '#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#10b981'][strength];
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/send-otp', {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      toast.success('OTP sent to your email!');
      setStep('otp');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', {
        email: form.email,
        otp: otp,
      });
      login(res.data.user, res.data.token);
      toast.success(`🎉 Welcome to Tech Connect, @${res.data.user.username}!`);
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await api.post('/auth/resend-otp', { email: form.email });
      toast.success('OTP resent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Animated background blobs */}
      <div className="auth-bg">
        <div className="auth-blob blob1" />
        <div className="auth-blob blob2" />
        <div className="auth-blob blob3" />
      </div>

      <div className="auth-card" style={{ maxWidth: '420px' }}>
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">💼</div>
          <span className="auth-logo-text">Tech Connect</span>
        </div>

        {step === 'signup' ? (
          <>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join thousands earning rewards daily</p>

            <form id="signup-form" className="auth-form" onSubmit={handleSendOTP}>
              <div className="form-group">
                <label htmlFor="signup-username">Username</label>
                <input
                  id="signup-username"
                  type="text"
                  name="username"
                  placeholder="Choose a unique username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={30}
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-email">Email Address</label>
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    style={{ paddingRight: '42px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                      fontSize: '16px', padding: 0, display: 'flex',
                    }}
                    aria-label="Toggle password"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {form.password && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: '2px', width: `${(strength / 5) * 100}%`, background: strengthColor, transition: 'width 0.3s ease' }} />
                    </div>
                    <span style={{ fontSize: '10px', color: strengthColor, fontWeight: '700', minWidth: '60px' }}>{strengthLabel}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="signup-confirm-password">Confirm Password</label>
                <input
                  id="signup-confirm-password"
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>

              <button
                id="signup-submit-btn"
                type="submit"
                className="btn-primary btn-full"
                disabled={loading}
                style={{ marginTop: '4px' }}
              >
                {loading ? <><span className="spinner-sm" />Sending OTP...</> : '🚀 Create Account'}
              </button>
            </form>

            <div className="auth-divider">or</div>

            <p className="auth-switch">
              Already have an account?{' '}
              <Link to="/login" className="auth-link" id="go-to-login">Sign In</Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="auth-title">Verify Email</h1>
            <p className="auth-subtitle">
              We sent a 6-digit code to <strong>{form.email}</strong>
            </p>

            <form id="otp-form" className="auth-form" onSubmit={handleVerifyOTP}>
              <div className="form-group">
                <label htmlFor="otp-input">Enter OTP Code</label>
                <input
                  id="otp-input"
                  type="text"
                  name="otp"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '20px' }}
                />
              </div>

              <button
                id="otp-verify-btn"
                type="submit"
                className="btn-primary btn-full"
                disabled={loading}
              >
                {loading ? <><span className="spinner-sm" />Verifying...</> : '✅ Verify & Login'}
              </button>
            </form>

            <p className="auth-switch" style={{ marginTop: '20px' }}>
              Didn't receive the code?{' '}
              <button
                type="button"
                className="auth-link"
                onClick={handleResendOTP}
                disabled={loading}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
              >
                Resend OTP
              </button>
            </p>
            
            <p className="auth-switch">
              <button
                type="button"
                className="auth-link"
                onClick={() => setStep('signup')}
                disabled={loading}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: 'var(--text-muted)' }}
              >
                ← Back to signup
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
