// ===== Sign In Page =====
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/Footer/Footer';
import styles from './SignInPage.module.css';

export default function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(phone, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.glow1} />
        <div className={styles.glow2} />

        <div className={styles.grid}>
          {/* Hero Side */}
          <div className={`${styles.heroSide} animate-slide-left`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <span className={styles.heroLabel}>System Integrity Secured</span>
              <h1 className={styles.heroTitle}>
                Command control <br /><span className={styles.heroAccent}>starts here.</span>
              </h1>
              <p className={styles.heroDesc}>
                Access the IncidentX high-stakes reliability platform. Real-time monitoring, automated response, and developer-first security protocols.
              </p>
            </div>

            <div className={styles.heroCards}>
              <div className={`${styles.heroCard} ${styles.heroCardBorderLeft} glass-panel`}>
                <span className="material-symbols-outlined" style={{ color: '#44e2cd' }}>shield_lock</span>
                <h3>MFA Enabled</h3>
                <p>Enterprise-grade security layers for every session.</p>
              </div>
              <div className={`${styles.heroCard} ${styles.heroCardBorderTertiary} glass-panel`}>
                <span className="material-symbols-outlined" style={{ color: '#7bd0ff' }}>bolt</span>
                <h3>Low Latency</h3>
                <p>Optimized routes for immediate incident access.</p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className={`${styles.formCard} glass-panel animate-slide-right`}>
            <div className={styles.formHeader}>
              <div className={styles.formLogo}>
                <div className={styles.formLogoIcon}>
                  <span className="material-symbols-outlined">hub</span>
                </div>
                <span className={styles.formLogoText}>IncidentX</span>
              </div>
              <h2 className={styles.formTitle}>Welcome Back</h2>
              <p className={styles.formSubtitle}>Secure authorization for authorized personnel only.</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Phone Number</label>
                <div className={`${styles.inputWrap} glass-panel`}>
                  <span className={`material-symbols-outlined ${styles.inputIcon}`}>call</span>
                  <input
                    id="signin-phone"
                    className={styles.input}
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.inputLabelRow}>
                  <label className={styles.inputLabel}>Password</label>
                  <a href="#" className={styles.forgotLink}>Forgot?</a>
                </div>
                <div className={`${styles.inputWrap} glass-panel`}>
                  <span className={`material-symbols-outlined ${styles.inputIcon}`}>lock</span>
                  <input
                    id="signin-password"
                    className={styles.input}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" className={styles.togglePassword} onClick={() => setShowPassword(!showPassword)}>
                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {error && <p className={styles.errorText}>{error}</p>}

              <button id="signin-submit" type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Authenticating...' : 'Authenticate Session'}
              </button>
            </form>

            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>Or continue via social</span>
            </div>

            <div className={styles.socialGrid}>
              <button className={`${styles.socialBtn} glass-panel`} onClick={handleSubmit}>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEVVeJFm2etV-fCwrnkA9DQQutlBlCf70A8LRvGnsmEkO8gYGiaLP0ewLTTOwxBJfjxKVXPCyrb0S7_w3BeZGiX83MMnaTGTQRuVmHtY1y8w853aFLkr6b5G-cvIp1rIgxslyoqpJdfS31W7TGarn3Sh7OP7bxaS-TOO7LBiepxbROghfwmWfQ5mfICtFkJf08S4hiPdFpcp8gFFj2C09ufbb5M_CVRgOZlBWl3ycIH5V5ClM5OZDgHDc9ZmptCdHOb9aHkAZo0M8m" alt="Google" />
              </button>
              <button className={`${styles.socialBtn} glass-panel`} onClick={handleSubmit}>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-on-surface-variant)' }}>social_leaderboard</span>
              </button>
              <button className={`${styles.socialBtn} glass-panel`} onClick={handleSubmit}>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-on-surface-variant)' }}>chat</span>
              </button>
            </div>

            <p className={styles.signupText}>
              Don't have an operator account? <a href="#" className={styles.signupLink}>Provision New Account</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
