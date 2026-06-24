import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext'; // Import hook path accurately

const AdminAuth = () => {
  const navigate = useNavigate();
  const { authenticateAdmin, loading, error, setError } = useAdmin();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSecretCode, setShowSecretCode] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminSecretCode: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // 🔧 NEW: secret code is now required on LOGIN too, not just
    // registration. The backend re-checks this against
    // ADMIN_REGISTRATION_SECRET on every login attempt — this is just
    // the matching client-side guard so the user gets immediate
    // feedback instead of a round trip for an empty field.
    if (!formData.adminSecretCode) {
      setError('Admin secret code is required');
      return;
    }

    const result = await authenticateAdmin(isLogin, formData);

    if (result.success) {
      if (result.action === 'login') {
        navigate('/');
      } else {
        alert('Admin Registered Successfully!');
        setIsLogin(true);
        setFormData({ username: '', email: '', password: '', confirmPassword: '', adminSecretCode: '' });
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isLogin ? 'Admin Login' : 'Admin Registration'}</h2>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                style={styles.inputWithIcon}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.iconButton}
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash size={20} color="#666" /> : <FaEye size={20} color="#666" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  style={styles.inputWithIcon}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.iconButton}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} color="#666" /> : <FaEye size={20} color="#666" />}
                </button>
              </div>
            </div>
          )}

          {/* 🔧 CHANGED: Admin Secret Code field is no longer wrapped in
              `{!isLogin && ...}` — it now renders for BOTH login and
              registration, since the backend now requires it on login
              as well. */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Admin Secret Code</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showSecretCode ? 'text' : 'password'}
                name="adminSecretCode"
                placeholder="Verification token"
                value={formData.adminSecretCode}
                onChange={handleInputChange}
                required
                style={styles.inputWithIcon}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowSecretCode(!showSecretCode)}
                style={styles.iconButton}
                tabIndex="-1"
              >
                {showSecretCode ? <FaEyeSlash size={20} color="#666" /> : <FaEye size={20} color="#666" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register Admin'}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isLogin ? "Need a new admin account? " : "Already have an account? "}
          <span
            style={styles.toggleLink}
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setShowPassword(false);
              setShowConfirmPassword(false);
              setShowSecretCode(false);
            }}
          >
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>
      </div>
    </div>
  );
};

// Keep your exact CSS styles definitions below here...
const styles = { /* ... styles object remains identical ... */ };

export default AdminAuth;