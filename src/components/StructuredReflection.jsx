import { parseReflectionSections, cleanMarkdownText } from "../utils/parseReflection.js";
import AyahActions from "./AyahActions.jsx";

/**
 * Renders a reflection either as 5 structured Islamic psychology section cards
 * or as clean prose if the reflection is unstructured.
 */
export default function StructuredReflection({ text, verifiedAyah = null, compact = false }) {
  const sections = parseReflectionSections(text);

  if (!sections) {
    return (
      <p
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: compact ? 13.5 : 14.5,
          lineHeight: 1.78,
          color: "#1d3129",
          whiteSpace: "pre-line",
          margin: 0,
        }}
      >
        {cleanMarkdownText(text)}
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 10 : 12 }}>
      {sections.map((sec) => (
        <div
          key={sec.number}
          style={{
            padding: compact ? "12px 14px" : "14px 16px",
            borderRadius: 14,
            border: sec.isAnchor ? "1px solid #bfdeca" : "1px solid #e6ede4",
            borderLeft: sec.isAnchor ? "3.5px solid #167754" : "1px solid #e6ede4",
            background: sec.isAnchor ? "#f0f7ef" : "#fcfdfa",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: sec.isAnchor ? "#ffffff" : "#167754",
                  background: sec.isAnchor ? "#167754" : "#e8f3ea",
                  padding: "2px 7px",
                  borderRadius: 999,
                }}
              >
                {sec.num}
              </span>
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: compact ? 14 : 15,
                  fontWeight: 600,
                  color: "#112117",
                }}
              >
                {sec.title}
              </span>
            </div>
            {sec.tag && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: sec.isAnchor ? "#0d5f3f" : "#6c8073",
                }}
              >
                {sec.tag}
              </span>
            )}
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: sec.isAnchor ? "'Playfair Display', Georgia, serif" : "'DM Sans', sans-serif",
              fontStyle: sec.isAnchor ? "italic" : "normal",
              fontSize: compact ? 13 : 13.8,
              lineHeight: 1.7,
              color: sec.isAnchor ? "#123825" : "#283c30",
              whiteSpace: "pre-line",
            }}
          >
            {sec.body}
          </p>
          {sec.isAnchor && verifiedAyah?.arabic && (
            <div
              style={{
                marginTop: 10,
                paddingTop: 10,
                borderTop: "1px solid #cde2ce",
              }}
            >
              <p
                style={{
                  margin: "0 0 4px",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: compact ? 17 : 19,
                  lineHeight: 1.75,
                  textAlign: "right",
                  direction: "rtl",
                  color: "#112117",
                }}
              >
                {verifiedAyah.arabic}
              </p>
              {verifiedAyah.translation && (
                <p style={{ margin: "0 0 4px", fontSize: 12.5, fontStyle: "italic", color: "#2d4c39" }}>
                  “{verifiedAyah.translation}”
                </p>
              )}
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#0d5f3f", textTransform: "uppercase" }}>
                ✓ Verified · Surah {verifiedAyah.verseKey}
              </span>
              <AyahActions
                verseKey={verifiedAyah.verseKey}
                audioUrl={verifiedAyah.audioUrl}
                compact={compact}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
