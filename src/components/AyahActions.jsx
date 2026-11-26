import { useEffect, useRef, useState } from "react";
import { fetchTafsir } from "../services/aiService.js";

/**
 * Provides Audio Recitation (Listen/Pause) and lazy-loaded Tafsir Ibn Kathir
 * for an Ayah card.
 */
export default function AyahActions({ verseKey, audioUrl, compact = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tafsirOpen, setTafsirOpen] = useState(false);
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [tafsirData, setTafsirData] = useState(null);
  const [tafsirError, setTafsirError] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    // Reset audio & tafsir when verseKey changes
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setTafsirOpen(false);
    setTafsirData(null);
    setTafsirError("");
  }, [verseKey, audioUrl]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleToggleAudio = async () => {
    if (!audioUrl) return;
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      if (!audioRef.current) {
        const audio = new Audio(audioUrl);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        audioRef.current = audio;
      }
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const handleToggleTafsir = async () => {
    if (tafsirOpen) {
      setTafsirOpen(false);
      return;
    }
    setTafsirOpen(true);
    if (tafsirData || tafsirLoading || !verseKey) return;

    setTafsirLoading(true);
    setTafsirError("");
    const res = await fetchTafsir(verseKey);
    if (res?.text) {
      setTafsirData(res);
    } else {
      setTafsirError("Tafsir for this Surah is available once Production Quran API access is enabled.");
    }
    setTafsirLoading(false);
  };

  if (!audioUrl && !verseKey) return null;

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {audioUrl && (
          <button
            type="button"
            onClick={handleToggleAudio}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: compact ? "4px 10px" : "5px 12px",
              borderRadius: 999,
              border: isPlaying ? "1px solid #167754" : "1px solid #cde0ce",
              background: isPlaying ? "#167754" : "#ffffff",
              color: isPlaying ? "#ffffff" : "#167754",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span>{isPlaying ? "❚❚" : "▶"}</span>
            <span>{isPlaying ? "Pause" : "Listen"}</span>
          </button>
        )}

        {verseKey && (
          <button
            type="button"
            onClick={handleToggleTafsir}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: compact ? "4px 10px" : "5px 12px",
              borderRadius: 999,
              border: tafsirOpen ? "1px solid #a48a49" : "1px solid #dce4d8",
              background: tafsirOpen ? "#fbf8ef" : "#ffffff",
              color: tafsirOpen ? "#7d6428" : "#4b6154",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span>{tafsirOpen ? "Hide Tafsir" : "Read Tafsir"}</span>
          </button>
        )}
      </div>

      {tafsirOpen && (
        <div
          style={{
            marginTop: 10,
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #e3decb",
            background: "#fcfaf3",
            maxHeight: 220,
            overflowY: "auto",
          }}
        >
          {tafsirLoading ? (
            <p style={{ margin: 0, fontSize: 12, color: "#6c8073" }}>Loading Tafsir…</p>
          ) : tafsirData ? (
            <>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#8c6d23",
                  marginBottom: 6,
                }}
              >
                {tafsirData.resourceName} · {tafsirData.verseKey}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 12.5,
                  lineHeight: 1.65,
                  color: "#2b3d32",
                  whiteSpace: "pre-line",
                }}
              >
                {tafsirData.text}
              </p>
            </>
          ) : (
            <p style={{ margin: 0, fontSize: 12, color: "#6c8073" }}>{tafsirError}</p>
          )}
        </div>
      )}
    </div>
  );
}
