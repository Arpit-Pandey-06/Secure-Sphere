import { theme } from "../../styles/theme";

export default function StatusDot({ status }) {
  const active = status === "active";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: active ? theme.red : theme.green,
          animation: active ? "pulse 1.5s infinite" : "none",
          display: "inline-block",
        }}
      />
      <span
        style={{
          fontSize: 12,
          color: active ? theme.red : theme.green,
          fontFamily: "'JetBrains Mono',monospace",
        }}>
        {status}
      </span>
    </span>
  );
}
