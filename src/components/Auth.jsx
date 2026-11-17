import { useState } from "react";
import { Link } from "react-router-dom";
import { signUp, login, logout } from "../services/authService.js";

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const IconEmail = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="#528469" strokeWidth="0.9" />
    <path d="M2 5.5l6 4 6-4" stroke="#528469" strokeWidth="0.9" strokeLinecap="round" />
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="4" y="7" width="8" height="7" rx="1.5" stroke="#528469" strokeWidth="0.9" />
    <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="#528469" strokeWidth="0.9" strokeLinecap="round" />
    <circle cx="8" cy="10.5" r="1" fill="#528469" />
  </svg>
);

const IconEye = ({ show }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    {show ? (
      <>
        <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="#528469" strokeWidth="0.9" />
        <circle cx="8" cy="8" r="2" stroke="#528469" strokeWidth="0.9" />
      </>
    ) : (
      <>
        <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="#528469" strokeWidth="0.9" />
        <path d="M3 3l10 10" stroke="#528469" strokeWidth="0.9" strokeLinecap="round" />
      </>
    )}
  </svg>
);

const IconUser = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="16" r="7" stroke="#528469" strokeWidth="1" />
    <path d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="#528469" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

/* ─────────────────────────────────────────
   FIELD COMPONENT
───────────────────────────────────────── */
function Field({ icon, label, type = "text", value, onChange, placeholder, rightEl }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "#397852",
        marginBottom: 7,
      }}>
        {label}
      </label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <span style={{
          position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          pointerEvents: "none", zIndex: 1,
        }}>
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="qalb-auth-input"
          style={{ paddingLeft: 40, paddingRight: rightEl ? 44 : 16 }}
        />
        {rightEl && (
          <span style={{
            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
            cursor: "pointer", zIndex: 1,
          }}>
            {rightEl}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   TOAST
───────────────────────────────────────── */
function Toast({ message, type, visible }) {
  const colors = {
    success: { bg: "rgba(255,255,255,0.98)", border: "#b7d3bd", text: "#28583a" },
    error:   { bg: "rgba(255,255,255,0.98)", border: "#e5b4ac", text: "#9d4034" },
  };
  const c = colors[type] || colors.success;
  return (
    <div style={{
      position: "fixed", top: 24, left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : -12}px)`,
      opacity: visible ? 1 : 0,
      background: c.bg,
      border: `0.5px solid ${c.border}`,
      borderRadius: 12,
      padding: "10px 22px",
      fontSize: 13,
      color: c.text,
      letterSpacing: "0.06em",
      backdropFilter: "blur(12px)",
      transition: "all 0.4s",
      zIndex: 99,
      pointerEvents: "none",
      whiteSpace: "nowrap",
    }}>
      {message}
    </div>
  );
}

/* ─────────────────────────────────────────
   LOGGED-IN STATE
───────────────────────────────────────── */
function LoggedIn({ user }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "100vh",
      padding: "0 24px",
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        border: "1px solid rgba(180,140,60,0.4)",
        background: "rgba(201,163,70,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 20,
      }}>
        <IconUser />
      </div>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6b9b80", marginBottom: 6 }}>
        Signed in as
      </p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#f0e6cc", marginBottom: 36 }}>
        {user.email}
      </p>
      <button onClick={logout} style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 15, letterSpacing: "0.1em",
        padding: "12px 36px", borderRadius: 12,
        border: "0.5px solid rgba(192,57,43,0.5)",
        background: "rgba(192,57,43,0.1)",
        color: "#f1948a", cursor: "pointer",
        transition: "all 0.22s",
      }}
        onMouseEnter={e => e.target.style.background = "rgba(192,57,43,0.2)"}
        onMouseLeave={e => e.target.style.background = "rgba(192,57,43,0.1)"}
      >
        Sign out
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN AUTH
───────────────────────────────────────── */
export default function Auth({ user, initialMode = "login" }) {
  const [mode, setMode]             = useState(initialMode);   // "login" | "signup"
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [toast, setToast]           = useState({ message: "", type: "success", visible: false });

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  const handleSubmit = async () => {
    if (!email || !password) { showToast("Please fill in all fields", "error"); return; }
    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(email, password);
        showToast("Welcome — your account is ready ✓");
      } else {
        await login(email, password);
        showToast("Welcome back ✓");
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  if (user) return (
    <>
      <style>{STYLES}</style>
      <div className="qalb-auth-root qalb-auth-root-signed-in">
        <div className="qalb-bg-pattern" />
        <div className="qalb-glow" />
        <LoggedIn user={user} />
      </div>
    </>
  );

  return (
    <>
      <style>{STYLES}</style>

      <div className="qalb-auth-root">
        <div className="qalb-bg-pattern" />
        <div className="qalb-glow" />
        <Link className="qalb-auth-home" to="/">← Back to QalbSense</Link>

        <Toast message={toast.message} type={toast.type} visible={toast.visible} />

        <div className="qalb-auth-wrap">

          {/* ── HEADER ── */}
          <header className="qalb-auth-header">
            {/* Crescent + star */}
            <svg width="52" height="52" viewBox="0 0 52 52" className="qalb-auth-emblem">
              <path d="M26 6C15.5 6 7 14.5 7 25s8.5 19 19 19c-5.5 0-9-4.5-9-10 0-8 5.5-13.5 9-15-4.5-1.5-8.5-.5-12 2C16 12 21 6 26 6z" fill="#39805a" opacity="0.9" />
              <circle cx="33" cy="12" r="2.5" fill="#39805a" opacity="0.7" />
              <polygon points="38,18 39.5,22.5 44,22.5 40.5,25 42,29.5 38,27 34,29.5 35.5,25 32,22.5 36.5,22.5" fill="#39805a" opacity="0.5" transform="scale(0.7) translate(17,8)" />
            </svg>

            <div className="qalb-auth-rule-row">
              <div className="qalb-rule" />
              <span className="qalb-auth-app-label">QalbSense</span>
              <div className="qalb-rule" />
            </div>

            <h1 className="qalb-auth-title">
              {mode === "login" ? "Welcome back" : "Begin your journey"}
            </h1>
            <p className="qalb-auth-subtitle">
              {mode === "login"
                ? "Your sanctuary awaits"
                : "A space for your heart to breathe"}
            </p>
          </header>

          {/* ── TAB TOGGLE ── */}
          <div className="qalb-auth-tabs">
            <button
              className={`qalb-tab${mode === "login" ? " active" : ""}`}
              onClick={() => setMode("login")}
            >
              Sign in
            </button>
            <button
              className={`qalb-tab${mode === "signup" ? " active" : ""}`}
              onClick={() => setMode("signup")}
            >
              Create account
            </button>
          </div>

          {/* ── FORM ── */}
          <div className="qalb-auth-form">
            <Field
              icon={<IconEmail />}
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <Field
              icon={<IconLock />}
              label="Password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              rightEl={
                <span onClick={() => setShowPass(s => !s)}>
                  <IconEye show={showPass} />
                </span>
              }
            />

            {/* Submit */}
            <button
              className="qalb-auth-btn-primary"
              onClick={handleSubmit}
              onKeyDown={handleKeyDown}
              disabled={loading}
            >
              {loading
                ? "Please wait…"
                : mode === "login" ? "Sign in" : "Create account"}
            </button>

            {/* Divider */}
            <div className="qalb-auth-divider">
              <div className="qalb-rule" />
              <span className="qalb-auth-divider-text">or</span>
              <div className="qalb-rule" />
            </div>

            {/* Mode switch */}
            <p className="qalb-auth-switch">
              {mode === "login" ? "New here?" : "Already have an account?"}
              {" "}
              <span
                className="qalb-auth-switch-link"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
              >
                {mode === "login" ? "Create an account" : "Sign in"}
              </span>
            </p>
          </div>

          {/* ── FOOTER AYAH ── */}
          <footer className="qalb-auth-footer">
            <div className="qalb-rule" style={{ flex: "none", width: 32 }} />
            <p className="qalb-auth-ayah">
              وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ
            </p>
            <div className="qalb-rule" style={{ flex: "none", width: 32 }} />
          </footer>
          <p className="qalb-auth-ayah-trans">
            "And He is with you wherever you are." — Al-Hadid 57:4
          </p>

        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.qalb-auth-root {
  background: #f5f7f0;
  min-height: 100vh;
  color: #1d3129;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 84px 20px 36px;
  position: relative;
  overflow: auto;
}

.qalb-auth-root-signed-in {
  background: #0a1a13;
  color: #f0e6cc;
  font-family: 'Lora', serif;
  overflow: hidden;
  padding: 32px 20px;
}

.qalb-auth-home {
  position: absolute;
  z-index: 2;
  top: 24px;
  left: 28px;
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  padding: 0 15px;
  border: 1px solid #e0e9df;
  border-radius: 999px;
  background: rgba(255,255,252,0.8);
  color: #42644e;
  font-size: 12px;
  text-decoration: none;
  transition: color 0.2s;
}
.qalb-auth-home:hover { color: #167754; }

.qalb-bg-pattern {
  position: fixed; inset: 0; pointer-events: none; opacity: 0.1;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cg fill='none' stroke='%2339805a' stroke-width='0.7'%3E%3Cpolygon points='40,4 47,18 62,18 51,27 55,42 40,33 25,42 29,27 18,18 33,18'/%3E%3Crect x='10' y='10' width='60' height='60' transform='rotate(45 40 40)'/%3E%3Ccircle cx='40' cy='40' r='25'/%3E%3C/g%3E%3C/svg%3E");
  background-size: 80px 80px;
}

.qalb-glow {
  position: fixed; top: -220px; left: 50%; transform: translateX(-50%);
  width: 700px; height: 440px;
  background: radial-gradient(ellipse, rgba(188,220,188,0.44) 0%, transparent 70%);
  pointer-events: none;
}

.qalb-auth-wrap {
  width: 100%; max-width: 420px;
  position: relative; z-index: 1;
  animation: authFadeIn 0.8s ease both;
}

/* Header */
.qalb-auth-header {
  text-align: center;
  margin-bottom: 25px;
}
.qalb-auth-emblem {
  display: block;
  width: 42px;
  height: 42px;
  margin: 0 auto 13px;
  animation: shimmer 3s ease-in-out infinite;
}
.qalb-auth-rule-row {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 14px;
}
.qalb-auth-app-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px; font-weight: 700; letter-spacing: 0.2em;
  text-transform: uppercase; color: #167754;
  white-space: nowrap;
}
.qalb-rule {
  flex: 1; height: 0.5px;
  background: linear-gradient(90deg, transparent, rgba(61,126,82,0.22), transparent);
}
.qalb-auth-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 36px; font-weight: 500;
  color: #1d3129; line-height: 1.2;
  margin-bottom: 9px;
}
.qalb-auth-subtitle {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: #78877c; font-weight: 400;
}

/* Tabs */
.qalb-auth-tabs {
  display: flex;
  border: 1px solid #e3ebe1;
  border-radius: 13px;
  background: rgba(233,240,231,0.64);
  padding: 4px;
  margin-bottom: 17px;
  gap: 4px;
}
.qalb-tab {
  flex: 1; padding: 10px 0;
  border-radius: 9px; border: 1px solid transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.25s;
  background: transparent; color: #78877c;
}
.qalb-tab.active {
  background: #fffefa;
  color: #167754;
  border-color: #e2eae0;
  box-shadow: 0 2px 6px rgba(34,70,44,0.06);
}
.qalb-tab:not(.active):hover {
  color: #42644e;
  background: rgba(255,255,255,0.58);
}

/* Form card */
.qalb-auth-form {
  background: #fffefa;
  border: 1px solid #e4ebe1;
  border-radius: 18px;
  padding: 25px 24px 23px;
  box-shadow: 0 18px 48px rgba(42,78,51,0.08);
  margin-bottom: 20px;
}

/* Input */
.qalb-auth-input {
  width: 100%; height: 48px;
  background: #fcfcf8;
  border: 1px solid #e4ebe1;
  border-radius: 11px;
  color: #263d30;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.qalb-auth-input::placeholder { color: #a0aca2; }
.qalb-auth-input:focus {
  border-color: #8db69a;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(84,145,101,0.1);
}

/* Primary button */
.qalb-auth-btn-primary {
  width: 100%; height: 50px;
  border-radius: 12px; border: none;
  background: #167754;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px; font-weight: 700; letter-spacing: 0.02em;
  cursor: pointer; transition: all 0.25s;
  box-shadow: 0 7px 16px rgba(22,119,84,0.16);
  margin-top: 7px; margin-bottom: 18px;
}
.qalb-auth-btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  background: #0c6347;
  box-shadow: 0 9px 20px rgba(22,119,84,0.22);
}
.qalb-auth-btn-primary:active:not(:disabled) { transform: translateY(0); }
.qalb-auth-btn-primary:disabled { opacity: 0.6; cursor: default; }

/* Divider */
.qalb-auth-divider {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 17px;
}
.qalb-auth-divider-text {
  font-size: 10px; letter-spacing: 0.12em;
  color: #95a397;
  text-transform: uppercase;
  white-space: nowrap;
}

/* Mode switch */
.qalb-auth-switch {
  text-align: center; font-size: 11px;
  color: #849087;
  font-family: 'DM Sans', sans-serif;
}
.qalb-auth-switch-link {
  color: #167754; cursor: pointer;
  text-decoration: underline; text-underline-offset: 3px;
  transition: color 0.2s;
}
.qalb-auth-switch-link:hover { color: #0c533c; }

/* Footer ayah */
.qalb-auth-footer {
  display: flex; align-items: center; justify-content: center; gap: 12px;
  margin-bottom: 7px;
}
.qalb-auth-ayah {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 16px; font-weight: 500;
  color: #548267;
  letter-spacing: 0.04em; direction: rtl;
  white-space: nowrap;
}
.qalb-auth-ayah-trans {
  text-align: center;
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  color: #849488;
  letter-spacing: 0.04em;
}

/* Animations */
@keyframes authFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0%,100% { opacity: 0.8; }
  50%      { opacity: 1; }
}

@media (max-width: 520px) {
  .qalb-auth-root { padding: 76px 17px 28px; }
  .qalb-auth-home { top: 16px; left: 17px; min-height: 34px; }
  .qalb-auth-title { font-size: 32px; }
  .qalb-auth-form { padding: 22px 19px 20px; }
}
`;
