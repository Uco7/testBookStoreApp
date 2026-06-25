import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';

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

    if (!formData.adminSecretCode) {
      setError('Admin secret code is required');
      return;
    }

    const result = await authenticateAdmin(isLogin, formData);

    if (result.success) {
      if (result.action === 'login') {
        navigate('/admin/dasbord-page');
      } else {
        alert('Admin Registered Successfully!');
        setIsLogin(true);
        setFormData({ username: '', email: '', password: '', confirmPassword: '', adminSecretCode: '' });
      }
    }
  };

  return (
    <div style={styles.page}>
      <style>{fontImports}</style>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.spine} aria-hidden="true" />

          <div style={styles.content}>
            <div style={styles.eyebrow}>RESTRICTED ACCESS</div>
            <h1 style={styles.title}>
              {isLogin ? 'Admin Login' : 'Admin Registration'}
            </h1>
            <p style={styles.subtitle}>
              {isLogin
                ? 'Sign in with your credentials and the admin secret code.'
                : 'Create a new administrator account for this library.'}
            </p>

            {error && (
              <div style={styles.errorAlert} role="alert">
                <span style={styles.errorDot} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              {!isLogin && (
                <Field label="Username">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    placeholder="jane.doe"
                  />
                </Field>
              )}

              <Field label="Email address">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="admin@library.com"
                />
              </Field>

              <Field label="Password">
                <PasswordInput
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  visible={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />
              </Field>

              {!isLogin && (
                <Field label="Confirm password">
                  <PasswordInput
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    visible={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </Field>
              )}

              <Field
                label="Admin secret code"
                hint="Required for every sign-in, not just registration."
              >
                <PasswordInput
                  name="adminSecretCode"
                  value={formData.adminSecretCode}
                  onChange={handleInputChange}
                  visible={showSecretCode}
                  onToggle={() => setShowSecretCode(!showSecretCode)}
                  placeholder="Verification token"
                  autoComplete="off"
                />
              </Field>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.button,
                  ...(loading ? styles.buttonDisabled : {}),
                }}
              >
                {loading ? (
                  <span style={styles.buttonContent}>
                    <span style={styles.spinner} />
                    Processing…
                  </span>
                ) : isLogin ? 'Sign in' : 'Register admin'}
              </button>
            </form>

            <p style={styles.toggleText}>
              {isLogin ? "Need a new admin account?" : "Already have an account?"}{' '}
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
                {isLogin ? 'Register here' : 'Sign in here'}
              </span>
            </p>
          </div>
        </div>

        <p style={styles.footnote}>
          Access is logged and limited to verified administrators.
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Small presentational helpers
// ─────────────────────────────────────────────

const Field = ({ label, hint, children }) => (
  <div style={styles.inputGroup}>
    <label style={styles.label}>{label}</label>
    {children}
    {hint && <span style={styles.hint}>{hint}</span>}
  </div>
);

const PasswordInput = ({ name, value, onChange, visible, onToggle, placeholder, autoComplete }) => (
  <div style={styles.passwordWrapper}>
    <input
      type={visible ? 'text' : 'password'}
      name={name}
      value={value}
      onChange={onChange}
      required
      style={styles.inputWithIcon}
      placeholder={placeholder}
      autoComplete={autoComplete}
    />
    <button
      type="button"
      onClick={onToggle}
      style={styles.iconButton}
      tabIndex="-1"
      aria-label={visible ? 'Hide value' : 'Show value'}
    >
      {visible ? <FaEyeSlash size={16} color="#8A8F9C" /> : <FaEye size={16} color="#8A8F9C" />}
    </button>
  </div>
);

// ─────────────────────────────────────────────
// Design tokens
//
// Palette:
//   ink        #10131C   page background
//   paper      #F7F4ED   card surface (warm off-white, "page" feel)
//   paperDim   #EDE8DC   input fields / subtle surfaces on paper
//   gold       #C9A04D   primary accent / CTA
//   goldDeep   #A9803A   CTA hover/active
//   slate      #6B7080   secondary text on paper
//   ink70      rgba ink  secondary text on ink
//   rust       #C2483D   error (desaturated, doesn't fight the gold)
//
// Type:
//   display — "Source Serif 4" (book/library subject — serif title)
//   body/UI — "Inter" (clean grotesque for labels, inputs, buttons)
// ─────────────────────────────────────────────

const fontImports = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600&display=swap');
`;

const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    background: 'radial-gradient(circle at 20% 15%, #181C28 0%, #10131C 60%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 20px',
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
  },
  container: {
    width: '100%',
    maxWidth: 440,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    background: '#F7F4ED',
    borderRadius: 10,
    display: 'flex',
    boxShadow: '0 30px 60px -20px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  // The "book spine" — the page's signature element. A solid bar on the
  // card's leading edge, echoing a shelved book viewed edge-on.
  spine: {
    width: 10,
    flexShrink: 0,
    background: 'linear-gradient(180deg, #C9A04D 0%, #A9803A 100%)',
  },
  content: {
    flex: 1,
    padding: '40px 36px 32px',
    boxSizing: 'border-box',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.14em',
    color: '#A9803A',
    marginBottom: 10,
  },
  title: {
    fontFamily: "'Source Serif 4', serif",
    fontSize: 30,
    fontWeight: 600,
    color: '#1B1E27',
    margin: 0,
    marginBottom: 8,
    letterSpacing: '-0.01em',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7080',
    lineHeight: 1.5,
    margin: 0,
    marginBottom: 28,
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(194, 72, 61, 0.08)',
    border: '1px solid rgba(194, 72, 61, 0.25)',
    color: '#A23A30',
    borderRadius: 8,
    padding: '11px 14px',
    fontSize: 13,
    marginBottom: 20,
  },
  errorDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#C2483D',
    flexShrink: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: 12.5,
    fontWeight: 600,
    color: '#3D414C',
    marginBottom: 7,
    letterSpacing: '0.01em',
  },
  hint: {
    fontSize: 11.5,
    color: '#9A9483',
    marginTop: 6,
  },
  input: {
    width: '100%',
    padding: '11px 13px',
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    color: '#1B1E27',
    background: '#EDE8DC',
    border: '1px solid transparent',
    borderRadius: 7,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 120ms ease, background 120ms ease',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputWithIcon: {
    width: '100%',
    padding: '11px 40px 11px 13px',
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    color: '#1B1E27',
    background: '#EDE8DC',
    border: '1px solid transparent',
    borderRadius: 7,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 120ms ease',
  },
  iconButton: {
    position: 'absolute',
    right: 10,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 6,
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    marginTop: 8,
    width: '100%',
    padding: '12px 0',
    fontSize: 14.5,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    color: '#1B1E27',
    background: 'linear-gradient(180deg, #D4AE5C 0%, #C9A04D 100%)',
    border: 'none',
    borderRadius: 7,
    cursor: 'pointer',
    letterSpacing: '0.01em',
    transition: 'filter 120ms ease, transform 120ms ease',
  },
  buttonDisabled: {
    cursor: 'not-allowed',
    filter: 'saturate(0.6) brightness(0.95)',
  },
  buttonContent: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  spinner: {
    width: 13,
    height: 13,
    borderRadius: '50%',
    border: '2px solid rgba(27,30,39,0.25)',
    borderTopColor: '#1B1E27',
    display: 'inline-block',
    animation: 'admin-auth-spin 0.7s linear infinite',
  },
  toggleText: {
    marginTop: 24,
    marginBottom: 0,
    fontSize: 13,
    color: '#6B7080',
    textAlign: 'center',
  },
  toggleLink: {
    color: '#A9803A',
    fontWeight: 600,
    cursor: 'pointer',
  },
  footnote: {
    marginTop: 22,
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
  },
};

// Keyframes for the loading spinner — injected once via the <style> tag
// already rendered above (fontImports), appended here so both share one
// stylesheet block without needing a separate .css file.
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
  @keyframes admin-auth-spin {
    to { transform: rotate(360deg); }
  }
  input::placeholder {
    color: #A6A192;
  }
  input:focus {
    border-color: #C9A04D !important;
    background: #F7F4ED !important;
  }
`;
if (!document.getElementById('admin-auth-keyframes')) {
  styleSheet.id = 'admin-auth-keyframes';
  document.head.appendChild(styleSheet);
}

export default AdminAuth;