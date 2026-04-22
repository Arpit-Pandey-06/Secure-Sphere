
import StatCard from "../../components/UI/StatCard";
import { theme } from "../../styles/theme";

const mockActivity = [
  { time:"09:11", event:"Phishing URL blocked", source:"Chrome Extension", type:"block" },
  { time:"08:23", event:"Malware detected in download", source:"Desktop Agent", type:"threat" },
  { time:"07:44", event:"Suspicious URL flagged", source:"Chrome Extension", type:"warn" },
  { time:"06:15", event:"System scan completed", source:"Desktop Agent", type:"scan" },
  { time:"05:02", event:"User logged in", source:"Web Dashboard", type:"info" },
];


export default function Dashboard({ stats, threats }) {
  const active = threats.filter((t) => t.status === "active").length;
  const critical = threats.filter((t) => t.severity === "critical").length;
  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 11,
            color: theme.textSecondary,
            fontFamily: "'JetBrains Mono',monospace",
            letterSpacing: 2,
            marginBottom: 4,
          }}>
          OVERVIEW
        </div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>
          Threat Intelligence Dashboard
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
        }}>
        <StatCard
          label="Total Threats"
          value={stats.total_threats}
          color={theme.accent}
          icon="⚡"
        />
        <StatCard label="Active" value={active} color={theme.red} icon="!" />
        <StatCard
          label="Resolved"
          value={stats.resolved_threats}
          color={theme.green}
          icon="✓"
        />
        <StatCard
          label="Scans Run"
          value={stats.total_scans}
          color={theme.purple}
          icon="◎"
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 20,
        }}>
        <div
          style={{
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: 8,
            padding: 20,
          }}>
          <div
            style={{
              fontSize: 11,
              color: theme.textSecondary,
              fontFamily: "'JetBrains Mono',monospace",
              letterSpacing: 2,
              marginBottom: 16,
            }}>
            THREATS BY TYPE
          </div>
          {Object.entries(stats.threats_by_type).map(([type, count]) => (
            <div key={type} style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}>
                <span style={{ fontSize: 13 }}>{type}</span>
                <span
                  style={{
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono',monospace",
                    color: theme.accent,
                  }}>
                  {count}
                </span>
              </div>
              <div style={{ height: 4, background: theme.bg, borderRadius: 2 }}>
                <div
                  style={{
                    height: "100%",
                    borderRadius: 2,
                    background:
                      type === "Malware"
                        ? theme.red
                        : type === "Phishing"
                          ? theme.amber
                          : theme.purple,
                    width: `${(count / stats.total_threats) * 100}%`,
                    transition: "width 1s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: 8,
            padding: 20,
          }}>
          <div
            style={{
              fontSize: 11,
              color: theme.textSecondary,
              fontFamily: "'JetBrains Mono',monospace",
              letterSpacing: 2,
              marginBottom: 16,
            }}>
            RECENT ACTIVITY
          </div>
          {mockActivity.map((a, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                marginBottom: 12,
              }}>
              <span
                className="mono"
                style={{
                  fontSize: 10,
                  color: theme.textDim,
                  minWidth: 40,
                  marginTop: 2,
                }}>
                {a.time}
              </span>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  marginTop: 5,
                  flexShrink: 0,
                  background:
                    a.type === "threat"
                      ? theme.red
                      : a.type === "block"
                        ? theme.amber
                        : a.type === "warn"
                          ? theme.purple
                          : theme.green,
                }}
              />
              <div>
                <div style={{ fontSize: 13 }}>{a.event}</div>
                <div
                  style={{
                    fontSize: 11,
                    color: theme.textSecondary,
                    fontFamily: "'JetBrains Mono',monospace",
                  }}>
                  {a.source}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderRadius: 8,
          padding: 20,
        }}>
        <div
          style={{
            fontSize: 11,
            color: theme.textSecondary,
            fontFamily: "'JetBrains Mono',monospace",
            letterSpacing: 2,
            marginBottom: 16,
          }}>
          SEVERITY BREAKDOWN
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(stats.threats_by_severity).map(([sev, count]) => {
            const colors = {
              critical: theme.red,
              high: theme.amber,
              medium: theme.purple,
              low: theme.green,
            };
            return (
              <div
                key={sev}
                style={{
                  flex: 1,
                  background: theme.bg,
                  borderRadius: 6,
                  padding: "12px 0",
                  textAlign: "center",
                  border: `1px solid ${theme.border}`,
                }}>
                <div
                  style={{ fontSize: 22, fontWeight: 800, color: colors[sev] }}>
                  {count}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    color: theme.textSecondary,
                    fontFamily: "'JetBrains Mono',monospace",
                    marginTop: 4,
                  }}>
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
