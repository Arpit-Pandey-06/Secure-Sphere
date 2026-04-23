import StatCard from "../../components/UI/StatCard";

export default function Dashboard({ stats, threats, colors, activeTheme }) {
  // Derive real-time data
  const activeCount = threats.filter((t) => t.status === "active").length;
  const recentActivity = threats
    .sort((a, b) => new Date(b.detected_at) - new Date(a.detected_at))
    .slice(0, 5);

  // Reusable card style for consistency
  const cardStyle = {
    background: colors.bgCard,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    padding: 24,
    position: "relative",
    overflow: "hidden",
    boxShadow: activeTheme === "light" ? "0 4px 20px rgba(0,0,0,0.04)" : "none",
    transition: "transform 0.2s ease",
  };

  const labelStyle = {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: 2,
    marginBottom: 20,
    textTransform: "uppercase",
  };

  return (
    <div className="fade-in">
      {/* HEADER SECTION */}
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={labelStyle}>System Overview</div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", color: colors.textPrimary }}>
            Threat Intelligence <span style={{ color: colors.accent }}>Dashboard</span>
          </div>
        </div>
        <div className="mono" style={{ fontSize: 11, color: colors.textDim }}>
          v2.1.0-STABLE // {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* STAT CARDS SECTION */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Threats" value={stats.total_threats} color={colors.accent} icon="⚡" colors={colors} />
        <StatCard label="Active" value={activeCount} color={colors.red} icon="!" colors={colors} />
        <StatCard label="Resolved" value={stats.resolved_threats} color={colors.green} icon="✓" colors={colors} />
        <StatCard label="Scans Run" value={stats.total_scans} color={colors.purple} icon="◎" colors={colors} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16, marginBottom: 24 }}>
        
        {/* THREATS BY TYPE */}
        <div style={cardStyle}>
          {/* Accent Stripe */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: `linear-gradient(90deg, ${colors.purple}, transparent)` }} />
          <div style={labelStyle}>Threats by Category</div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {Object.entries(stats.threats_by_type).map(([type, count]) => (
              <div key={type}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{type}</span>
                  <span className="mono" style={{ fontSize: 13, color: colors.accent }}>{count}</span>
                </div>
                <div style={{ height: 6, background: colors.bg, borderRadius: 10 }}>
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 10,
                      background: colors.accent,
                      boxShadow: `0 0 10px ${colors.accentGlow}`,
                      width: `${stats.total_threats > 0 ? (count / stats.total_threats) * 100 : 0}%`,
                      transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY FEED */}
        <div style={cardStyle}>
          <div style={labelStyle}>Live Activity Feed</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {recentActivity.length === 0 ? (
              <div style={{ fontSize: 12, color: colors.textDim, textAlign: 'center', padding: '40px' }}>// SYSTEM IDLE</div>
            ) : (
              recentActivity.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", paddingBottom: 12, borderBottom: i !== 4 ? `1px solid ${colors.border}` : "none" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.status === "active" ? colors.red : colors.green, boxShadow: `0 0 8px ${a.status === "active" ? colors.redGlow : colors.greenGlow}` }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{a.type}</div>
                    <div className="mono" style={{ fontSize: 10, color: colors.textSecondary }}>{a.source}</div>
                  </div>
                  <span className="mono" style={{ fontSize: 10, color: colors.textDim }}>
                    {new Date(a.detected_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SEVERITY MATRIX */}
      <div style={cardStyle}>
        <div style={labelStyle}>Risk Severity Matrix</div>
        <div style={{ display: "flex", gap: 12 }}>
          {["critical", "high", "medium", "low"].map((sev) => {
            const count = stats.threats_by_severity[sev] || 0;
            const sevColors = { critical: colors.red, high: colors.amber, medium: colors.purple, low: colors.green };
            const glows = { critical: colors.redGlow, high: colors.amberGlow, medium: colors.purpleGlow, low: colors.greenGlow };
            
            return (
              <div key={sev} style={{ 
                flex: 1, 
                background: activeTheme === "light" ? colors.bg : "rgba(255,255,255,0.02)", 
                borderRadius: 8, 
                padding: "20px 0", 
                textAlign: "center", 
                border: `1px solid ${colors.border}`,
                transition: "all 0.3s ease"
              }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: sevColors[sev], textShadow: `0 0 15px ${glows[sev]}` }}>{count}</div>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: colors.textSecondary, fontFamily: "'JetBrains Mono',monospace", marginTop: 8 }}>
                  {sev}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}