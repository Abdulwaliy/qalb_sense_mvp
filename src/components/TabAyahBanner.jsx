export default function TabAyahBanner({ arabic, translation, reference }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "16px 20px 0" }}>
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 5,
          maxWidth: 580,
          padding: "12px 24px",
          borderRadius: 999,
          background: "rgba(22, 119, 84, 0.08)",
          border: "1px solid rgba(22, 119, 84, 0.24)",
          boxShadow: "0 0 24px rgba(22, 119, 84, 0.07)",
          textAlign: "center",
        }}
      >
        <span
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: "'Amiri', 'Playfair Display', serif",
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1.55,
            color: "#0b5e3f",
          }}
        >
          {arabic}
        </span>

        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12.5,
            fontWeight: 500,
            lineHeight: 1.45,
            color: "#1d3129",
          }}
        >
          “{translation}”{" "}
          <strong style={{ color: "#0b5e3f", fontWeight: 700 }}>· {reference}</strong>
        </span>
      </div>
    </div>
  );
}
