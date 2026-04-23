import { theme } from "../../styles/theme";
import { useState } from "react";
import SeverityBadge from "../../components/UI/SeverityBadge";
import StatusDot from "../../components/UI/StatusDot";

export default function ThreatsPage({ threats, onResolve }) {
  const [filter, setFilter] = useState("all");

  // Logic: Deterministic filtering based on real-time database state
  const filtered =
    filter === "all" ? threats : threats.filter((t) => t.status === filter);

  return (
    <div className="fade-in">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 20,
        }}>
        <div>
          <div
            style={{
              fontSize: 11,
              color: theme.textSecondary,
              fontFamily: "'JetBrains Mono',monospace",
              letterSpacing: 2,
              marginBottom: 4,
            }}>
            MONITORING
          </div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Threat Log</div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: "flex", gap: 4 }}>
          {["all", "active", "resolved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 14px",
                borderRadius: 5,
                border: `1px solid ${filter === f ? theme.accent : theme.border}`,
                background: filter === f ? theme.accentGlow : "transparent",
                color: filter === f ? theme.accent : theme.textSecondary,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "'Syne',sans-serif",
                textTransform: "capitalize",
                transition: "all 0.2s"
              }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderRadius: 8,
          overflow: "hidden",
        }}>
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 0.8fr 1fr 1fr 0.8fr",
            padding: "10px 16px",
            borderBottom: `1px solid ${theme.border}`,
            fontSize: 10,
            color: theme.textDim,
            fontFamily: "'JetBrains Mono',monospace",
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}>
          {["Target", "Type", "Severity", "Source", "Status", "Action"].map(
            (h) => (
              <span key={h}>{h}</span>
            ),
          )}
        </div>

        {/* Threat Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: theme.textDim, fontSize: 13 }}>
            No threats found in the current log.
          </div>
        ) : (
          filtered.map((t, i) => (
            <div
              key={t.id} // Matches the 'id' string from your threats router
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 0.8fr 1fr 1fr 0.8fr",
                padding: "12px 16px",
                borderBottom:
                  i < filtered.length - 1 ? `1px solid ${theme.border}` : "none",
                alignItems: "center",
                fontSize: 13,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = theme.bgPanel)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }>
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  color: theme.textSecondary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  paddingRight: 10
                }}>
                {t.url || t.file_path || "—"}
              </span>
              <span style={{ color: theme.textPrimary }}>{t.type}</span>
              <SeverityBadge severity={t.severity} />
              <span style={{ fontSize: 12, color: theme.textSecondary }}>
                {t.source}
              </span>
              <StatusDot status={t.status} />
              
              {t.status === "active" ? (
                <button
                  onClick={() => onResolve(t.id)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 4,
                    border: `1px solid ${theme.greenDim}`,
                    background: theme.greenGlow,
                    color: theme.green,
                    cursor: "pointer",
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono',monospace",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => e.target.style.background = theme.green}
                  onMouseLeave={(e) => e.target.style.background = theme.greenGlow}
                >
                  Resolve
                </button>
              ) : (
                <span
                  style={{
                    fontSize: 11,
                    color: theme.textDim,
                    fontFamily: "'JetBrains Mono',monospace",
                  }}>
                  —
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}