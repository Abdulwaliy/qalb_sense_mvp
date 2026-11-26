import { useEffect } from "react";
import StructuredReflection from "./StructuredReflection.jsx";

export default function ReflectionModal({
  isOpen,
  onClose,
  mood,
  date,
  time,
  text,
  verifiedAyah = null,
  journalContent = "",
}) {
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || (!text && !journalContent)) return null;

  const isJournalOnly = !text && Boolean(journalContent);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Full reflection"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 120,
        background: "rgba(17, 33, 23, 0.48)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 16px",
        animation: "qalbModalFade 0.2s ease both",
      }}
    >
      <style>{`
        @keyframes qalbModalFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes qalbModalPop  { from { opacity: 0; transform: translateY(14px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 620,
          maxHeight: "86vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 22,
          border: "1px solid #d5e2d3",
          background: "#ffffff",
          boxShadow: "0 24px 70px rgba(17, 33, 23, 0.25)",
          overflow: "hidden",
          animation: "qalbModalPop 0.25s cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      >
        {/* Top accent */}
        <div style={{ height: 3, background: "linear-gradient(90deg, #167754, #a48a49, #167754)" }} />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "16px 20px",
            borderBottom: "1px solid #edf1ea",
            background: "#fcfdfa",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 19,
                  fontWeight: 600,
                  color: "#112117",
                }}
              >
                {isJournalOnly ? "✎ From Your Journal" : "✦ Your Reflection"}
              </span>
              {mood && (
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    padding: "2px 10px",
                    borderRadius: 999,
                    border: "1px solid #c0decb",
                    background: "#eef6f0",
                    color: "#167754",
                  }}
                >
                  {mood}
                </span>
              )}
            </div>
            {(date || time) && (
              <div style={{ fontSize: 11.5, color: "#687b6f", marginTop: 3 }}>
                {date}{time ? ` · ${time}` : ""}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close reflection"
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "1px solid #dce5da",
              background: "#ffffff",
              color: "#3d5446",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: "18px 20px 22px", overflowY: "auto" }}>
          {text && <StructuredReflection text={text} verifiedAyah={verifiedAyah} />}

          {journalContent && (
            <div
              style={{
                marginTop: text ? 16 : 0,
                padding: isJournalOnly ? "16px 18px" : "12px 14px",
                borderRadius: 14,
                background: "#f7faf6",
                border: "1px solid #e2e9df",
              }}
            >
              {text && (
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#586b61",
                    marginBottom: 6,
                  }}
                >
                  From your journal
                </div>
              )}
              <p
                style={{
                  margin: 0,
                  fontSize: isJournalOnly ? 14.5 : 13,
                  lineHeight: 1.75,
                  color: "#1d3129",
                  fontStyle: isJournalOnly ? "normal" : "italic",
                  whiteSpace: "pre-line",
                }}
              >
                {journalContent}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
