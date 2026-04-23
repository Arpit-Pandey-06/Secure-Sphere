import { useState, useEffect } from "react";
import { theme } from "../../styles/theme";
import StatCard from "../../components/UI/StatCard";
import api from "../../services/api"; // Use your configured axios instance

export default function NSFWPage() {
  const [enabled, setEnabled] = useState(true);
  const [strictMode, setStrictMode] = useState(false);
  const [blockedCount, setBlockedCount] = useState(0); // Synchronized state
  const [url, setUrl] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  // 1. Fetch live stats and settings from the backend on load
  useEffect(() => {
    const fetchNSFWData = async () => {
      try {
        const res = await api.get("/nsfw/stats");
        setBlockedCount(res.data.blocked_today);
        setEnabled(res.data.status === "ON");
        setStrictMode(res.data.mode === "STRICT");
      } catch (err) {
        console.error("Failed to sync NSFW stats:", err);
      }
    };
    fetchNSFWData();
  }, []);

  const checkURL = async () => {
    if (!url) return;
    setChecking(true);
    setCheckResult(null);

    try {
      // 2. Use Axios for the deterministic check
      const res = await api.post("/nsfw/check", { 
        url: url,
        strict_mode: strictMode 
      });
      
      setCheckResult(res.data);
      
      // Update local count if blocked to show immediate feedback
      if (res.data.blocked) {
        setBlockedCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Content Safety Scan Error:", error);
      setCheckResult({
        url,
        blocked: true,
        category: "System Error",
        confidence: 0,
        details: "Could not reach the classification engine."
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: theme.textSecondary, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 2, marginBottom: 4 }}>
          CONTENT SAFETY
        </div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>NSFW Content Control</div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <StatCard label="Blocked Today" value={blockedCount} color={theme.red} icon="✗" />
        <StatCard label="Status" value={enabled ? "ON" : "OFF"} color={enabled ? theme.green : theme.textSecondary} icon="◎" />
        <StatCard label="Mode" value={strictMode ? "STRICT" : "NORMAL"} color={strictMode ? theme.amber : theme.accent} icon="⚡" />
      </div>

      {/* FILTER SETTINGS PANEL */}
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 24, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Filter Settings</div>
        {[
          { label: "NSFW Filter", desc: "Block adult and explicit content", val: enabled, set: setEnabled },
          { label: "Strict Mode", desc: "Block borderline and suggestive content", val: strictMode, set: setStrictMode },
        ].map(({ label, desc, val, set }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${theme.border}` }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
              <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>{desc}</div>
            </div>
            <button
              onClick={() => set(!val)}
              style={{ width: 44, height: 24, borderRadius: 12, border: "none", background: val ? theme.accent : theme.border, cursor: "pointer", position: "relative", transition: "background 0.2s" }}
            >
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: theme.bg, position: "absolute", top: 3, left: val ? 23 : 3, transition: "left 0.2s" }} />
            </button>
          </div>
        ))}
      </div>

      {/* URL CLASSIFIER PANEL */}
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Check a URL</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkURL()}
            placeholder="https://example.com"
            style={{ flex: 1, background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 6, padding: "9px 14px", color: theme.textPrimary, fontSize: 13, fontFamily: "'JetBrains Mono',monospace" }}
            onFocus={(e) => (e.target.style.borderColor = theme.accentDim)}
            onBlur={(e) => (e.target.style.borderColor = theme.border)}
          />
          <button
            onClick={checkURL}
            disabled={checking || !url}
            style={{ padding: "9px 20px", borderRadius: 6, border: "none", background: checking || !url ? theme.bgPanel : theme.accent, color: checking || !url ? theme.textSecondary : theme.bg, fontFamily: "'Syne',sans-serif", fontWeight: 700, cursor: checking || !url ? "not-allowed" : "pointer", fontSize: 13 }}
          >
            {checking ? "Checking..." : "Check"}
          </button>
        </div>

        {checkResult && (
          <div className="fade-in" style={{ background: theme.bg, borderRadius: 6, padding: 14, border: `1px solid ${checkResult.blocked ? theme.redDim : theme.greenDim}` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 18 }}>{checkResult.blocked ? "🚫" : "✅"}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: checkResult.blocked ? theme.red : theme.green }}>
                  {checkResult.blocked ? "BLOCKED" : "SAFE"} — {checkResult.category}
                </div>
                <div className="mono" style={{ fontSize: 11, color: theme.textSecondary }}>
                  Confidence: {checkResult.confidence}% · {checkResult.url}
                </div>
                {checkResult.details && (
                  <div className="mono" style={{ fontSize: 10, color: theme.textDim, marginTop: 4 }}>
                    Reason: {checkResult.details}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}