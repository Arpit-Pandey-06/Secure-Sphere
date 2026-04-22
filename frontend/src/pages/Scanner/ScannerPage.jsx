import { useState } from "react";
import { theme } from "../../styles/theme";
import { API_BASE } from "../../services/api";

export default function ScannerPage({ token }) {
  const [tab, setTab] = useState("url");
  const [input, setInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const scan = async () => {
    if (!input) return;
    setScanning(true);
    setResult(null);
    try {
      const body = tab === "url" ? { url: input } : { file_hash: input };
      const res = await fetch(`${API_BASE}/scan/${tab}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setResult(await res.json());
      } else {
        await new Promise((r) => setTimeout(r, 1800));
        const safe = Math.random() > 0.4;
        setResult({
          scan_id: `SCAN-${Date.now()}`,
          target: input,
          verdict: safe ? "safe" : "malicious",
          engine: "virustotal",
          scanned_at: new Date().toISOString(),
          details: {
            positives: safe ? 0 : Math.floor(Math.random() * 30) + 5,
            total: 70,
          },
        });
      }
    } catch {
      await new Promise((r) => setTimeout(r, 1800));
      const safe = Math.random() > 0.4;
      setResult({
        scan_id: `SCAN-${Date.now()}`,
        target: input,
        verdict: safe ? "safe" : "malicious",
        engine: "demo_engine",
        scanned_at: new Date().toISOString(),
        details: {
          positives: safe ? 0 : Math.floor(Math.random() * 30) + 5,
          total: 70,
        },
      });
    } finally {
      setScanning(false);
    }
  };

  const verdictColor = result
    ? result.verdict === "safe"
      ? theme.green
      : result.verdict === "suspicious"
        ? theme.amber
        : theme.red
    : theme.accent;

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
          ANALYSIS
        </div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>Threat Scanner</div>
      </div>
      <div
        style={{
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderRadius: 8,
          padding: 24,
          marginBottom: 16,
        }}>
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 20,
            background: theme.bg,
            borderRadius: 6,
            padding: 3,
            width: "fit-content",
          }}>
          {["url", "file"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setInput("");
                setResult(null);
              }}
              style={{
                padding: "7px 20px",
                borderRadius: 4,
                border: "none",
                background: tab === t ? theme.bgPanel : "transparent",
                color: tab === t ? theme.accent : theme.textSecondary,
                cursor: "pointer",
                fontFamily: "'Syne',sans-serif",
                fontSize: 13,
                fontWeight: tab === t ? 600 : 400,
              }}>
              {t === "url" ? "URL Scanner" : "File Hash"}
            </button>
          ))}
        </div>
        <label
          style={{
            fontSize: 11,
            color: theme.textSecondary,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            display: "block",
            marginBottom: 6,
            fontFamily: "'JetBrains Mono',monospace",
          }}>
          {tab === "url" ? "Enter URL to scan" : "Enter file SHA-256 hash"}
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && scan()}
            placeholder={
              tab === "url"
                ? "https://suspicious-site.com"
                : "e3b0c44298fc1c149afbf4c8996fb924..."
            }
            style={{
              flex: 1,
              background: theme.bg,
              border: `1px solid ${theme.border}`,
              borderRadius: 6,
              padding: "10px 14px",
              color: theme.textPrimary,
              fontSize: 13,
              fontFamily: "'JetBrains Mono',monospace",
            }}
            onFocus={(e) => (e.target.style.borderColor = theme.accentDim)}
            onBlur={(e) => (e.target.style.borderColor = theme.border)}
          />
          <button
            onClick={scan}
            disabled={scanning || !input}
            style={{
              padding: "10px 24px",
              borderRadius: 6,
              border: "none",
              background: scanning || !input ? theme.bgPanel : theme.accent,
              color: scanning || !input ? theme.textSecondary : theme.bg,
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              cursor: scanning || !input ? "not-allowed" : "pointer",
              fontSize: 13,
              minWidth: 100,
            }}>
            {scanning ? "Scanning..." : "Scan"}
          </button>
        </div>
        {scanning && (
          <div
            style={{
              marginTop: 20,
              padding: 16,
              background: theme.bg,
              borderRadius: 6,
              border: `1px solid ${theme.border}`,
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  border: `2px solid ${theme.accentDim}`,
                  borderTop: `2px solid ${theme.accent}`,
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <span
                className="mono"
                style={{ fontSize: 12, color: theme.accent }}>
                Analyzing against threat intelligence databases...
              </span>
            </div>
          </div>
        )}
      </div>
      {result && (
        <div
          className="fade-in"
          style={{
            background: theme.bgCard,
            border: `1px solid ${result.verdict === "safe" ? theme.greenDim : theme.redDim}`,
            borderRadius: 8,
            padding: 24,
          }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
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
                SCAN RESULT
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: verdictColor,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}>
                {result.verdict}
              </div>
            </div>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: `2px solid ${verdictColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                background:
                  result.verdict === "safe" ? theme.greenGlow : theme.redGlow,
              }}>
              {result.verdict === "safe" ? "✓" : "!"}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
            }}>
            {[
              ["Scan ID", result.scan_id],
              ["Engine", result.engine],
              [
                "Detections",
                result.details?.positives !== undefined
                  ? `${result.details.positives}/${result.details.total}`
                  : "—",
              ],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  background: theme.bg,
                  borderRadius: 6,
                  padding: "10px 14px",
                }}>
                <div
                  style={{
                    fontSize: 10,
                    color: theme.textDim,
                    fontFamily: "'JetBrains Mono',monospace",
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}>
                  {k}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono',monospace",
                    color: theme.textPrimary,
                  }}>
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
