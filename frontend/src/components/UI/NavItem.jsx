export default function NavItem({ icon, label, active, onClick, colors }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        borderRadius: 8,
        cursor: "pointer",
        transition: "all 0.2s ease",
        background: active ? colors.accentGlow : "transparent",
        borderLeft: active ? `3px solid ${colors.accent}` : "3px solid transparent",
        marginBottom: 4,
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = colors.bgPanel;
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      <span style={{ 
        fontSize: 16, 
        color: active ? colors.accent : colors.textSecondary 
      }}>
        {icon}
      </span>
      <span style={{ 
        fontSize: 14, 
        fontWeight: active ? 600 : 400, 
        color: active ? colors.textPrimary : colors.textSecondary, // Critical fix for visibility
        fontFamily: "'Syne', sans-serif"
      }}>
        {label}
      </span>
    </div>
  );
}