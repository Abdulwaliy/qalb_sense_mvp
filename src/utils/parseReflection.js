const SECTION_META = [
  { num: "01", label: "Mirror of the Heart", tag: "Al-Qalb" },
  { num: "02", label: "Insight", tag: "Fahm an-Nafs" },
  { num: "03", label: "Prophetic Reframe", tag: "At-Tazkiyah" },
  { num: "04", label: "Sunnah Action Step", tag: "‘Amal" },
  { num: "05", label: "Spiritual Anchor", tag: "Qur’an & Du‘ā’" },
];

const HEADING_REGEX =
  /(?:^|\n)\s*(?:#{1,3}\s*)?(?:\*{1,2})?([1-5])\.\s*([^\n*]+?)(?:\*{1,2})?\s*(?::|\n|$)/g;

/**
 * Cleanly removes stray markdown bold/heading markers for plain display.
 */
export function cleanMarkdownText(text) {
  if (!text) return "";
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/^\s*#{1,3}\s+/gm, "")
    .trim();
}

/**
 * Parses a 5-section reflection string (both new and legacy headings) into structured objects.
 * Returns null if the text does not contain at least 3 numbered sections.
 */
export function parseReflectionSections(rawText) {
  if (!rawText || typeof rawText !== "string") return null;

  const matches = [];
  let match;
  HEADING_REGEX.lastIndex = 0;

  while ((match = HEADING_REGEX.exec(rawText)) !== null) {
    matches.push({
      index: match.index,
      endOfHeading: match.index + match[0].length,
      number: Number(match[1]),
      rawTitle: match[2].replace(/[:*]+$/g, "").trim(),
    });
  }

  if (matches.length < 3) return null;

  return matches.map((m, i) => {
    const nextStart = i + 1 < matches.length ? matches[i + 1].index : rawText.length;
    const body = cleanMarkdownText(rawText.slice(m.endOfHeading, nextStart));
    const meta = SECTION_META[m.number - 1] || {
      num: String(m.number).padStart(2, "0"),
      label: m.rawTitle,
      tag: "",
    };

    return {
      number: m.number,
      num: meta.num,
      title: m.rawTitle || meta.label,
      tag: meta.tag,
      body,
      isAnchor: m.number === 5,
    };
  });
}
