import { theme } from "../../styles/theme";

export default function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        borderRadius: 6,
        border: "none",
        background: active ? theme.accentGlow : "transparent",
        color: active ? theme.accent : theme.textSecondary,
        cursor: "pointer",
        width: "100%",
        textAlign: "left",
        fontSize: 13,
        fontFamily: "'Syne',sans-serif",
        fontWeight: active ? 600 : 400,
        transition: "all 0.2s",
        borderLeft: active
          ? `2px solid ${theme.accent}`
          : "2px solid transparent",
      }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      {label}
    </button>
  );
}
