import { theme } from "../../styles/theme";
import SeverityBadge from "../../components/UI/SeverityBadge";


export default function AlertsPage({ threats }) {
  const active = threats.filter((t) => t.status === "active");
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
          NOTIFICATIONS
        </div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>Active Alerts</div>
      </div>
      {active.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            color: theme.textSecondary,
          }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
          <div
            style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>
            No active alerts
          </div>
        </div>
      )}
      {active.map((t, i) => (
        <div
          key={t.id}
          className="fade-in"
          style={{
            background: theme.bgCard,
            border: `1px solid ${t.severity === "critical" ? theme.redDim : theme.border}`,
            borderRadius: 8,
            padding: 20,
            marginBottom: 10,
            borderLeft: `3px solid ${t.severity === "critical" ? theme.red : t.severity === "high" ? theme.amber : theme.purple}`,
          }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8,
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <SeverityBadge severity={t.severity} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>
                {t.type} Detected
              </span>
            </div>
            <span
              className="mono"
              style={{ fontSize: 11, color: theme.textSecondary }}>
              {new Date(t.detected_at).toLocaleTimeString()}
            </span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: theme.textSecondary,
              fontFamily: "'JetBrains Mono',monospace",
              marginBottom: 6,
            }}>
            {t.details}
          </div>
          <div
            style={{
              fontSize: 11,
              color: theme.textDim,
              fontFamily: "'JetBrains Mono',monospace",
            }}>
            {t.url || t.file_path} · {t.source}
          </div>
        </div>
      ))}
    </div>
  );
}
