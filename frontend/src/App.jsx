import { useState, useEffect } from "react";
import "./styles/global.css"
import NavItem from "./components/UI/NavItem";
import { theme } from "./styles/theme";
import LoginPage from "./pages/Auth/LoginPage";
import { API_BASE } from "./services/api";
import Dashboard from "./pages/Dashboard/Dashboard";
import ThreatsPage from "./pages/Threats/ThreatsPage";
import ScannerPage from "./pages/Scanner/ScannerPage";
import AlertsPage from "./pages/Alerts/AlertsPage";
import NSFWPage from "./pages/NSFW/NSFWPage";





const mockThreats = [
  { id:1, type:"Malware", severity:"critical", source:"Desktop Agent", status:"active", url:null, file_path:"C:/Users/Downloads/setup.exe", details:"Trojan.GenericKD detected", detected_at:"2025-04-16T08:23:11" },
  { id:2, type:"Phishing", severity:"high", source:"Extension", status:"active", url:"http://secure-bank-login.ru/verify", file_path:null, details:"Credential harvesting page", detected_at:"2025-04-16T09:11:44" },
  { id:3, type:"Ransomware", severity:"critical", source:"Desktop Agent", status:"resolved", url:null, file_path:"C:/Windows/Temp/crypt.dll", details:"WannaCry variant signature", detected_at:"2025-04-15T22:05:30" },
  { id:4, type:"Phishing", severity:"medium", source:"Extension", status:"active", url:"http://paypal-verify.info", file_path:null, details:"Known phishing domain", detected_at:"2025-04-16T07:44:20" },
  { id:5, type:"Malware", severity:"low", source:"Desktop Agent", status:"resolved", url:null, file_path:"C:/Temp/adware.exe", details:"Adware.BrowseFox", detected_at:"2025-04-15T18:30:00" },
];

const mockStats = { total_threats:47, active_threats:12, resolved_threats:35, total_scans:234, threats_by_type:{"Malware":18,"Phishing":22,"Ransomware":7}, threats_by_severity:{"critical":8,"high":15,"medium":14,"low":10} };



//  All states
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [token, setToken] = useState("demo_token");
  const [threats, setThreats] = useState(mockThreats);
  const [stats] = useState(mockStats);
  const [connected, setConnected] = useState(false);

  // Effects 
  useEffect(() => {
    const saved = localStorage.getItem("ss_token");
    if (saved) { setToken(saved); setPage("dashboard"); }
    fetch(`${API_BASE.replace("/api", "")}/health`).then(() => setConnected(true)).catch(() => setConnected(false));
  }, []);
  
  // Logic Functions 
  const onLogin = (data) => { setToken(data.access_token); setPage("dashboard"); };
  const onLogout = () => { localStorage.removeItem("ss_token"); setToken(null); setPage("login"); };
  const onResolve = (id) => setThreats(prev => prev.map(t => t.id===id ? {...t, status:"resolved"} : t));

  if (page === "login") {
    return  <LoginPage onLogin={onLogin} />
  }


  const navItems = [
    { id:"dashboard", icon:"◈", label:"Dashboard" },
    { id:"threats", icon:"⚡", label:"Threats" },
    { id:"scanner", icon:"◎", label:"Scanner" },
    { id:"alerts", icon:"!", label:"Alerts", badge: threats.filter(t=>t.status==="active").length },
    { id:"nsfw", icon:"⊘", label:"NSFW Control" },
  ];

let content;

if (page === "dashboard") {
  content = <Dashboard stats={stats} threats={threats} />;
} else if (page === "threats") {
  content = <ThreatsPage threats={threats} onResolve={onResolve} />;
} else if (page === "scanner") {
  content = <ScannerPage token={token} />;
} else if (page === "alerts") {
  content = <AlertsPage threats={threats} />;
} else if (page === "nsfw") {
  content = <NSFWPage token={token} />;
}

  return (
    
      <div style={{ display:"flex", minHeight:"100vh", background:theme.bg }}>
        <div style={{ width:220, background:theme.bgCard, borderRight:`1px solid ${theme.border}`, display:"flex", flexDirection:"column", flexShrink:0, position:"fixed", top:0, bottom:0, left:0 }}>
          <div style={{ padding:"20px 16px", borderBottom:`1px solid ${theme.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:30, height:30, borderRadius:6, background:theme.accentGlow, border:`1px solid ${theme.accentDim}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🛡</div>
              <div>
                <div style={{ fontSize:14, fontWeight:800, letterSpacing:-0.3 }}>SecureSphere</div>
                <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:1 }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background: connected?theme.green:theme.amber, animation:"pulse 2s infinite" }} />
                  <span className="mono" style={{ fontSize:9, color: connected?theme.green:theme.amber, letterSpacing:1 }}>{connected?"CONNECTED":"DEMO MODE"}</span>
                </div>
              </div>
            </div>
          </div>
          <nav style={{ flex:1, padding:"12px 8px" }}>
            {navItems.map(item => (
              <div key={item.id} style={{ position:"relative", marginBottom:2 }}>
                <NavItem icon={item.icon} label={item.label} active={page===item.id} onClick={() => setPage(item.id)} />
                {item.badge > 0 && <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:theme.red, color:"#fff", fontSize:10, fontFamily:"'JetBrains Mono',monospace", padding:"1px 6px", borderRadius:10, minWidth:18, textAlign:"center" }}>{item.badge}</span>}
              </div>
            ))}
          </nav>
          <div style={{ padding:"12px 16px", borderTop:`1px solid ${theme.border}` }}>
            <div className="mono" style={{ fontSize:10, color:theme.textDim, marginBottom:8, letterSpacing:1 }}>API: localhost:8000</div>
            <button onClick={onLogout} style={{ width:"100%", padding:"8px 0", borderRadius:5, border:`1px solid ${theme.border}`, background:"transparent", color:theme.textSecondary, cursor:"pointer", fontFamily:"'Syne',sans-serif", fontSize:12, transition:"all 0.2s" }}
              onMouseEnter={e => { e.target.style.borderColor=theme.red; e.target.style.color=theme.red; }}
              onMouseLeave={e => { e.target.style.borderColor=theme.border; e.target.style.color=theme.textSecondary; }}>
              Sign Out
            </button>
          </div>
        </div>
        <div style={{ marginLeft:220, flex:1, padding:"28px 28px" }}>
          {content}
        </div>
      </div>
  
  );
}
