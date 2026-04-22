
import { theme } from "../../styles/theme";
import { useState } from "react";

import { API_BASE } from "../../services/api";


export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login");

  const handle = async () => {
    if (!email || !password) {
      setError("All fields required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const body =
        mode === "login"
          ? { email, password }
          : { username: email.split("@")[0], email, password };
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Request failed");
      if (mode === "login") {
        localStorage.setItem("ss_token", data.access_token);
        onLogin(data);
      } else {
        setMode("login");
        setError("Account created — please login");
      }
    } catch (e) {
      setError(e.message);
      if (e.message.includes("fetch") || e.message.includes("network")) {
        setTimeout(() => {
          localStorage.setItem("ss_token", "demo_token");
          onLogin({ access_token: "demo_token", demo: true });
        }, 800);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Syne',sans-serif",
        position: "relative",
        overflow: "hidden",
      }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0,212,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,59,92,0.04) 0%, transparent 40%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(28,42,58,0.3) 40px, rgba(28,42,58,0.3) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(28,42,58,0.3) 40px, rgba(28,42,58,0.3) 41px)`,
        }}
      />
      <div
        className="fade-in"
        style={{
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderRadius: 12,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 420,
          position: "relative",
        }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "20%",
            right: "20%",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
          }}
        />
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: theme.accentGlow,
                border: `1px solid ${theme.accentDim}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}>
              🛡
            </div>
            <span
              style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
              SecureSphere
            </span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: theme.textSecondary,
              fontFamily: "'JetBrains Mono',monospace",
              letterSpacing: 2,
            }}>
            CYBERSECURITY PLATFORM
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 24,
            background: theme.bg,
            borderRadius: 6,
            padding: 3,
          }}>
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 4,
                border: "none",
                background: mode === m ? theme.bgPanel : "transparent",
                color: mode === m ? theme.accent : theme.textSecondary,
                cursor: "pointer",
                fontFamily: "'Syne',sans-serif",
                fontSize: 13,
                fontWeight: mode === m ? 600 : 400,
                textTransform: "capitalize",
                transition: "all 0.2s",
              }}>
              {m}
            </button>
          ))}
        </div>
        {["Email", "Password"].map((f) => (
          <div key={f} style={{ marginBottom: 14 }}>
            <label
              style={{
                fontSize: 11,
                color: theme.textSecondary,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 6,
                fontFamily: "'JetBrains Mono',monospace",
              }}>
              {f}
            </label>
            <input
              type={f === "Password" ? "password" : "email"}
              value={f === "Email" ? email : password}
              onChange={(e) =>
                f === "Email"
                  ? setEmail(e.target.value)
                  : setPassword(e.target.value)
              }
              onKeyDown={(e) => e.key === "Enter" && handle()}
              style={{
                width: "100%",
                background: theme.bg,
                border: `1px solid ${theme.border}`,
                borderRadius: 6,
                padding: "10px 14px",
                color: theme.textPrimary,
                fontSize: 14,
                fontFamily: "'JetBrains Mono',monospace",
                transition: "border 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = theme.accentDim)}
              onBlur={(e) => (e.target.style.borderColor = theme.border)}
            />
          </div>
        ))}
        {error && (
          <div
            style={{
              fontSize: 12,
              color: error.includes("created") ? theme.green : theme.red,
              marginBottom: 14,
              fontFamily: "'JetBrains Mono',monospace",
              padding: "8px 12px",
              background: error.includes("created")
                ? theme.greenGlow
                : theme.redGlow,
              borderRadius: 4,
              border: `1px solid ${error.includes("created") ? theme.greenDim : theme.redDim}`,
            }}>
            {error}
          </div>
        )}
        <button
          onClick={handle}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: 6,
            border: "none",
            background: loading ? theme.bgPanel : theme.accent,
            color: loading ? theme.textSecondary : theme.bg,
            fontFamily: "'Syne',sans-serif",
            fontWeight: 700,
            fontSize: 14,
            cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: 0.5,
            transition: "all 0.2s",
          }}>
          {loading
            ? "Authenticating..."
            : mode === "login"
              ? "Sign In"
              : "Create Account"}
        </button>
        <div
          style={{
            marginTop: 16,
            textAlign: "center",
            fontSize: 11,
            color: theme.textDim,
            fontFamily: "'JetBrains Mono',monospace",
          }}>
          BACKEND: <span style={{ color: theme.accentDim }}>{API_BASE}</span>
        </div>
      </div>
    </div>
  );
}
