import { theme } from "../../styles/theme";

export default function StatCard({ label, value, color, icon }) {
  return (
    <div
      style={{
        background: theme.bgCard,
        border: `1px solid ${theme.border}`,
        borderRadius: 8,
        padding: "16px 20px",
        flex: 1,
        minWidth: 140,
        position: "relative",
        overflow: "hidden",
      }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />
      <div
        style={{
          fontSize: 11,
          color: theme.textSecondary,
          textTransform: "uppercase",
          letterSpacing: 2,
          marginBottom: 10,
          fontFamily: "'JetBrains Mono',monospace",
        }}>
        {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>
        {value}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 12,
          right: 16,
          fontSize: 28,
          opacity: 0.07,
          fontFamily: "'JetBrains Mono',monospace",
          color,
        }}>
        {icon}
      </div>
    </div>
  );
}
