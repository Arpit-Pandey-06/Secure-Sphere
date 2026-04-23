import { useState, useEffect } from "react";
import api, { API_BASE } from "./services/api"; 
import "./styles/global.css";
import NavItem from "./components/UI/NavItem";
import { theme } from "./styles/theme";
import LoginPage from "./pages/Auth/LoginPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import ThreatsPage from "./pages/Threats/ThreatsPage";
import ScannerPage from "./pages/Scanner/ScannerPage";
import AlertsPage from "./pages/Alerts/AlertsPage";
import NSFWPage from "./pages/NSFW/NSFWPage";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [token, setToken] = useState(null);
  const [threats, setThreats] = useState([]); 
  const [stats, setStats] = useState(null);    
  const [connected, setConnected] = useState(false);
  
  // Theme State
  const [mode, setMode] = useState(localStorage.getItem("ss_theme") || "auto");
  const [activeTheme, setActiveTheme] = useState("dark");

  // Logic: Theme Switching
  useEffect(() => {
    const handleThemeChange = () => {
      let selection = mode;
      if (mode === "auto") {
        selection = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      setActiveTheme(selection);
      localStorage.setItem("ss_theme", mode);
    };

    handleThemeChange();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleThemeChange);
    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, [mode]);

  // Derived Colors Object (Use this everywhere!)
  const colors = { ...theme, ...theme[activeTheme] };

  // Logic: Initial Load
  useEffect(() => {
    if (window.location.pathname === "/blocked") setPage("blocked");
    
    const saved = localStorage.getItem("ss_token");
    if (saved) setToken(saved);
    else setPage("login");
    
    api.get("/health")
      .then(() => setConnected(true))
      .catch(() => setConnected(false));
  }, []);

  // Logic: Data Fetching Function
  const fetchData = async () => {
    if (!token || page === "blocked" || page === "login") return;
    try {
      const [statsRes, threatsRes] = await Promise.all([
        api.get("/dashboard/stats/"),
        api.get("/threats/")
      ]);
      setStats(statsRes.data);
      setThreats(threatsRes.data);
    } catch (err) {
      console.error("Sync Error:", err);
    }
  };

  // Trigger Fetching
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [token, page]);

  const onLogin = (data) => {
    localStorage.setItem("ss_token", data.access_token);
    setToken(data.access_token);
    setPage("dashboard");
  };

  const onLogout = () => {
    localStorage.removeItem("ss_token");
    setToken(null);
    setPage("login");
  };

  // --- RENDER GATES ---

  if (page === "blocked") return (
    <div style={{ background: colors.bg, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ background: colors.bgCard, padding: 40, borderRadius: 12, border: `1px solid ${colors.red}`, maxWidth: 450 }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🛑</div>
        <h1 style={{ color: colors.red, fontWeight: 800 }}>ACCESS RESTRICTED</h1>
        <p style={{ color: colors.textSecondary }}>The SecureSphere Browser Agent has intercepted a connection to a malicious domain.</p>
        <button onClick={() => { window.history.pushState({}, "", "/"); setPage("dashboard"); }} style={{ background: colors.accent, color: colors.bg, border: "none", padding: "12px 24px", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>Return to Safety</button>
      </div>
    </div>
  );

  if (page === "login" || !token) return <LoginPage onLogin={onLogin} />;

  if (!stats) return (
    <div style={{ background: colors.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="mono" style={{ color: colors.accent }}>INITIALIZING SECURESPHERE_CORE...</div>
    </div>
  );

  const navItems = [
    { id: "dashboard", icon: "◈", label: "Dashboard" },
    { id: "threats", icon: "⚡", label: "Threats" },
    { id: "scanner", icon: "◎", label: "Scanner" },
    { id: "alerts", icon: "!", label: "Alerts", badge: threats.filter(t => t.status === "active").length },
    { id: "nsfw", icon: "⊘", label: "NSFW Control" },
  ];

  let content;
  if (page === "dashboard") content = <Dashboard stats={stats} threats={threats} colors={colors} />;
  else if (page === "threats") content = <ThreatsPage threats={threats} colors={colors} />;
  else if (page === "scanner") content = <ScannerPage token={token} colors={colors} />;
  else if (page === "alerts") content = <AlertsPage threats={threats} colors={colors} />;
  else if (page === "nsfw") content = <NSFWPage token={token} colors={colors} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: colors.bg, color: colors.textPrimary }}>
      {/* SIDEBAR */}
      <div style={{ width: 220, background: colors.bgCard, borderRight: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, left: 0 }}>
        
        <div style={{ padding: "20px 16px", borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 6, background: colors.accentGlow, border: `1px solid ${colors.accentDim}`, display: "flex", alignItems: "center", justifyContent: "center" }}>🛡</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>SecureSphere</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: connected ? colors.green : colors.amber }} />
                <span className="mono" style={{ fontSize: 9, color: connected ? colors.green : colors.amber }}>{connected ? "CONNECTED" : "DEMO"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* THEME TOGGLE (Inside Sidebar) */}
        <div style={{ margin: "12px 16px", display: "flex", gap: 2, background: colors.bg, padding: 2, borderRadius: 6, border: `1px solid ${colors.border}` }}>
          {["light", "dark", "auto"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1, padding: "6px 0", borderRadius: 4, border: "none", fontSize: 10, cursor: "pointer",
                background: mode === m ? colors.accent : "transparent",
                color: mode === m ? colors.bg : colors.textDim,
                fontWeight: 700, transition: "0.2s"
              }}
            >
              {m === "auto" ? "🌓" : m}
            </button>
          ))}
        </div>

       <nav style={{ flex: 1, padding: "4px 8px" }}>
  {navItems.map(item => (
    <div key={item.id} style={{ position: "relative" }}>
      <NavItem 
        icon={item.icon} 
        label={item.label} 
        active={page === item.id} 
        onClick={() => setPage(item.id)} 
        colors={colors}  // <--- Add this!
      />
      {item.badge > 0 && (
        <span style={{ 
          position: "absolute", 
          right: 10, 
          top: "50%", 
          transform: "translateY(-50%)", 
          background: colors.red, 
          color: "#fff", 
          fontSize: 10, 
          padding: "1px 6px", 
          borderRadius: 10 
        }}>
          {item.badge}
        </span>
      )}
    </div>
  ))}
</nav>

        <div style={{ padding: "12px 16px", borderTop: `1px solid ${colors.border}` }}>
          <button onClick={onLogout} style={{ width: "100%", padding: "8px 0", borderRadius: 5, border: `1px solid ${colors.border}`, background: "transparent", color: colors.textSecondary, cursor: "pointer" }}>Sign Out</button>
        </div>
      </div>

      <div style={{ marginLeft: 220, flex: 1, padding: "28px" }}>
        {content}
      </div>
    </div>
  );
}