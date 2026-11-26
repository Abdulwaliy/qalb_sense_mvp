// server/quranService.js
// Integrates with Quran Foundation Content API v4 (https://api-docs.quran.foundation/)

const SURAH_NAME_TO_NUMBER = {
  "al-fatihah": 1, "fatihah": 1,
  "al-baqarah": 2, "baqarah": 2,
  "ali 'imran": 3, "al-imran": 3, "imran": 3,
  "an-nisa": 4, "nisa": 4,
  "al-ma'idah": 5, "maidah": 5,
  "al-an'am": 6, "anam": 6,
  "al-a'raf": 7, "araf": 7,
  "al-anfal": 8, "anfal": 8,
  "at-tawbah": 9, "tawbah": 9,
  "yunus": 10, "hud": 11, "yusuf": 12,
  "ar-ra'd": 13, "ra'd": 13, "rad": 13,
  "ibrahim": 14, "al-hijr": 15, "an-nahl": 16,
  "al-isra": 17, "isra": 17, "al-kahf": 18, "kahf": 18,
  "maryam": 19, "taha": 20, "ta-ha": 20,
  "al-anbiya": 21, "al-hajj": 22, "al-mu'minun": 23,
  "an-nur": 24, "al-furqan": 25, "ash-shu'ara": 26,
  "an-naml": 27, "al-qasas": 28, "al-ankabut": 29,
  "ar-rum": 30, "luqman": 31, "as-sajdah": 32,
  "al-ahzab": 33, "saba": 34, "fatir": 35,
  "yasin": 36, "ya-sin": 36, "as-saffat": 37, "sad": 38,
  "az-zumar": 39, "zumar": 39, "ghafir": 40, "fussilat": 41,
  "ash-shura": 42, "az-zukhruf": 43, "ad-dukhan": 44,
  "al-jathiyah": 45, "al-ahqaf": 46, "muhammad": 47,
  "al-fath": 48, "al-hujurat": 49, "qaf": 50,
  "adh-dhariyat": 51, "at-tur": 52, "an-najm": 53,
  "al-qamar": 54, "ar-rahman": 55, "rahman": 55,
  "al-waqi'ah": 56, "al-hadid": 57, "al-mujadila": 58,
  "al-hashr": 59, "al-mumtahanah": 60, "as-saf": 61,
  "al-jumu'ah": 62, "al-munafiqun": 63, "at-taghabun": 64,
  "at-talaq": 65, "talaq": 65, "at-tahrim": 66, "al-mulk": 67,
  "al-qalam": 68, "al-haqqah": 69, "al-ma'arij": 70,
  "nuh": 71, "al-jinn": 72, "al-muzzammil": 73, "al-muddaththir": 74,
  "al-qiyamah": 75, "al-insan": 76, "al-mursalat": 77,
  "an-naba": 78, "an-nazi'at": 79, "abasa": 80, "at-takwir": 81,
  "al-infitar": 82, "al-mutaffifin": 83, "al-inshiqaq": 84,
  "al-buruj": 85, "at-tariq": 86, "al-a'la": 87, "al-ghashiyah": 88,
  "al-fajr": 89, "al-balad": 90, "ash-shams": 91, "shams": 91,
  "al-layl": 92, "ad-duha": 93, "duha": 93,
  "ash-sharh": 94, "al-inshirah": 94, "inshirah": 94,
  "at-tin": 95, "al-alaq": 96, "al-qadr": 97, "al-bayyinah": 98,
  "az-zalzalah": 99, "al-adiyat": 100, "al-qari'ah": 101,
  "at-takathur": 102, "al-asr": 103, "al-humazah": 104,
  "al-fil": 105, "quraysh": 106, "al-ma'un": 107, "al-kawthar": 108,
  "al-kafirun": 109, "an-nasr": 110, "al-masad": 111,
  "al-ikhlas": 112, "al-falaq": 113, "an-nas": 114,
};

export const CURATED_MOOD_VERSES = {
  // Pleasant / Grounded
  Grateful: [
    { key: "14:7", source: "Ibrahim 14:7", theme: "Ash-Shukr · Gratitude", arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ", translation: "If you are grateful, I will surely increase you in favor." },
    { key: "27:40", source: "An-Naml 27:40", theme: "Shukr & Tawāḍu‘ · Humble Gratitude", arabic: "هَٰذَا مِن فَضْلِ رَبِّي لِيَبْلُوَنِي أَأَشْكُرُ أَمْ أَكْفُرُ", translation: "This is from the favor of my Lord to test me whether I will be grateful or ungrateful." },
  ],
  Inspired: [
    { key: "29:69", source: "Al-Ankabut 29:69", theme: "Al-Himmah · Striving with Purpose", arabic: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا", translation: "And those who strive for Us—We will surely guide them to Our ways." },
  ],
  Joyful: [
    { key: "10:58", source: "Yunus 10:58", theme: "Al-Faraḥ · Spiritual Joy", arabic: "قُلْ بِفَضْلِ اللَّهِ وَبِرَحْمَتِهِ فَبِذَٰلِكَ فَلْيَفْرَحُوا", translation: "In the bounty of Allah and in His mercy—in that let them rejoice." },
  ],
  Serene: [
    { key: "48:4", source: "Al-Fath 48:4", theme: "As-Sakīnah · Tranquility of Heart", arabic: "هُوَ الَّذِي أَنزَلَ السَّكِينَةَ فِي قُلُوبِ الْمُؤْمِنِينَ", translation: "It is He who sent down tranquility into the hearts of the believers." },
    { key: "26:89", source: "Ash-Shu'ara 26:89", theme: "Qalbin Salīm · The Sound Heart", arabic: "إِلَّا مَنْ أَتَى اللَّهَ بِقَلْبٍ سَلِيمٍ", translation: "Except one who comes to Allah with a sound heart." },
  ],
  Hopeful: [
    { key: "94:6", source: "Al-Inshirah 94:6", theme: "Al-Yusr · Ease After Hardship", arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "Verily, with every hardship comes ease." },
    { key: "65:7", source: "At-Talaq 65:7", theme: "Ar-Rajā’ · Hope After Difficulty", arabic: "سَيَجْعَلُ اللَّهُ بَعْدَ عُسْرٍ يُسْرًا", translation: "Allah will bring about, after hardship, ease." },
  ],
  Content: [
    { key: "89:27", source: "Al-Fajr 89:27", theme: "An-Nafs al-Muṭma’innah · Reassured Soul", arabic: "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ", translation: "O reassured soul..." },
    { key: "10:58", source: "Yunus 10:58", theme: "Al-Faraḥ · Spiritual Joy", arabic: "قُلْ بِفَضْلِ اللَّهِ وَبِرَحْمَتِهِ فَبِذَٰلِكَ فَلْيَفْرَحُوا", translation: "In the bounty of Allah and in His mercy—in that let them rejoice." },
  ],
  Relieved: [
    { key: "94:5", source: "Al-Inshirah 94:5", theme: "Al-Faraj · Relief Alongside Hardship", arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "For indeed, with hardship will be ease." },
  ],
  Present: [
    { key: "23:2", source: "Al-Mu'minun 23:2", theme: "Al-Khushū‘ · Humble Presence", arabic: "الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ", translation: "Those who are humbly attentive in their prayer." },
  ],
  // High-Arousal / Agitated
  Anxious: [
    { key: "13:28", source: "Ar-Ra'd 13:28", theme: "Iṭmi’nān al-Qalb · Heart Serenity", arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", translation: "Surely in the remembrance of Allah do hearts find comfort." },
    { key: "65:3", source: "At-Talaq 65:3", theme: "At-Tawakkul · Sacred Reliance", arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", translation: "And whoever relies upon Allah—then He is sufficient for them." },
  ],
  Overwhelmed: [
    { key: "2:286", source: "Al-Baqarah 2:286", theme: "Al-Wus‘ · Psychological Capacity", arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", translation: "Allah does not burden a soul beyond what it can bear." },
    { key: "94:6", source: "Al-Inshirah 94:6", theme: "Al-Yusr · Relief in Constriction", arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "Verily, with every hardship comes ease." },
  ],
  Frustrated: [
    { key: "3:134", source: "Ali 'Imran 3:134", theme: "Kaẓm al-Ghayẓ · Emotional Regulation", arabic: "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ", translation: "Those who restrain anger and pardon people—and Allah loves the doers of good." },
    { key: "42:37", source: "Ash-Shura 42:37", theme: "Al-‘Afw · Forgiving Strength", arabic: "وَإِذَا مَا غَضِبُوا هُمْ يَغْفِرُونَ", translation: "And when they are angry, they forgive." },
  ],
  Restless: [
    { key: "13:28", source: "Ar-Ra'd 13:28", theme: "Dhikr · Calming Scattered Thoughts", arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", translation: "Surely in the remembrance of Allah do hearts find comfort." },
    { key: "73:8", source: "Al-Muzzammil 73:8", theme: "At-Tabattul · Quiet Devotion", arabic: "وَاذْكُرِ اسْمَ رَبِّكَ وَتَبَتَّلْ إِلَيْهِ تَبْتِيلًا", translation: "And remember the name of your Lord and devote yourself to Him with complete devotion." },
  ],
  // Low-Arousal / Heavy
  Grieving: [
    { key: "93:3", source: "Ad-Duha 93:3", theme: "Ar-Raḥmah · Emotional Consolation", arabic: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ", translation: "Your Lord has not abandoned you, nor has He become displeased." },
    { key: "12:86", source: "Yusuf 12:86", theme: "Ash-Shakwā ilallāh · Vulnerability Before Allah", arabic: "إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ", translation: "I only complain of my suffering and my grief to Allah." },
  ],
  Lonely: [
    { key: "9:40", source: "At-Tawbah 9:40", theme: "Al-Ma‘iyyah · Divine Companionship", arabic: "لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا", translation: "Do not grieve; indeed Allah is with us." },
    { key: "50:16", source: "Qaf 50:16", theme: "Al-Qurb · Allah's Nearness", arabic: "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ", translation: "And We are closer to him than his jugular vein." },
  ],
  Remorseful: [
    { key: "39:53", source: "Az-Zumar 39:53", theme: "At-Tawbah & Ar-Raḥmah · Mercy & Return", arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ", translation: "Say, O My servants who have transgressed against themselves: do not despair of the mercy of Allah." },
  ],
  Discouraged: [
    { key: "12:87", source: "Yusuf 12:87", theme: "Ar-Rajā’ · Never Despairing of Relief", arabic: "إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ", translation: "Indeed, no one despairs of relief from Allah except the disbelieving people." },
  ],
  Exhausted: [
    { key: "2:286", source: "Al-Baqarah 2:286", theme: "Al-Wus‘ · Psychological Capacity", arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", translation: "Allah does not burden a soul beyond what it can bear." },
    { key: "2:185", source: "Al-Baqarah 2:185", theme: "Al-Yusr · Divine Ease", arabic: "يُرِيدُ اللَّهُ بِكُمُ الْيُسْرَ وَلَا يُرِيدُ بِكُمُ الْعُسْرَ", translation: "Allah intends for you ease and does not intend for you hardship." },
  ],
  Numb: [
    { key: "57:16", source: "Al-Hadid 57:16", theme: "Khushū‘ al-Qalb · Softening the Heart", arabic: "أَلَمْ يَأْنِ لِلَّذِينَ آمَنُوا أَن تَخْشَعَ قُلُوبُهُمْ لِذِكْرِ اللَّهِ", translation: "Has the time not come for those who have believed that their hearts should become humbly soft at the remembrance of Allah?" },
    { key: "39:53", source: "Az-Zumar 39:53", theme: "Ar-Raḥmah · Return Without Despair", arabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ", translation: "Do not despair of the mercy of Allah." },
  ],
  Unmotivated: [
    { key: "94:7", source: "Al-Inshirah 94:7", theme: "Al-‘Azīmah · Renewed Resolve", arabic: "فَإِذَا فَرَغْتَ فَانصَبْ", translation: "So when you have finished your duties, then stand up for worship and effort." },
  ],
  "Burnt Out": [
    { key: "73:8", source: "Al-Muzzammil 73:8", theme: "At-Tabattul · Sacred Rest & Reconnection", arabic: "وَاذْكُرِ اسْمَ رَبِّكَ وَتَبَتَّلْ إِلَيْهِ تَبْتِيلًا", translation: "And remember the name of your Lord and devote yourself to Him with complete devotion." },
  ],
  neutral: [
    { key: "91:9", source: "Ash-Shams 91:9", theme: "At-Tazkiyah · Soul Purification", arabic: "قَدْ أَفْلَحَ مَن زَكَّاهَا", translation: "He has succeeded who purifies the soul." },
    { key: "59:18", source: "Al-Hashr 59:18", theme: "Al-Muḥāsabah · Self-Reckoning", arabic: "وَلْتَنظُرْ نَفْسٌ مَّا قَدَّمَتْ لِغَدٍ", translation: "Let every soul look to what it has sent forth for tomorrow." },
  ],
};

const MOOD_ALIASES = {
  Happy: "Grateful",
  Sad: "Grieving",
  Angry: "Frustrated",
  Calm: "Serene",
  Tired: "Exhausted",
};

let cachedToken = null;
let tokenExpiresAt = 0;

function getEndpoints() {
  const isPrelive = process.env.QURAN_ENV === "prelive";
  return {
    oauthUrl: isPrelive
      ? "https://prelive-oauth2.quran.foundation/oauth2/token"
      : "https://oauth2.quran.foundation/oauth2/token",
    apiBase: isPrelive
      ? "https://apis-prelive.quran.foundation/content/api/v4"
      : "https://apis.quran.foundation/content/api/v4",
  };
}

export function isQuranApiConfigured() {
  return Boolean(process.env.QURAN_CLIENT_ID && process.env.QURAN_CLIENT_SECRET);
}

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const clientId = process.env.QURAN_CLIENT_ID;
  const clientSecret = process.env.QURAN_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const { oauthUrl } = getEndpoints();
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(oauthUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=content.quran.read content.translations.read content.tafsirs.read content.audio.read",
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Quran OAuth error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;
  return cachedToken;
}

function stripHtmlTags(str = "") {
  return str
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function buildFallbackAudioUrl(verseKey = "") {
  const parts = String(verseKey).split(":");
  if (parts.length !== 2) return null;
  const surah = parts[0].padStart(3, "0");
  const ayah = parts[1].padStart(3, "0");
  return `https://verses.quran.com/Alafasy/mp3/${surah}${ayah}.mp3`;
}

function resolveAudioUrl(audioObj, verseKey) {
  const raw = audioObj?.url;
  if (!raw) return buildFallbackAudioUrl(verseKey);
  if (raw.startsWith("http")) return raw;
  return `https://verses.quran.com/${raw.replace(/^\/+/, "")}`;
}

/**
 * Fetches a verified verse (Uthmani Arabic + Clear Quran translation + Alafasy audio) by key, e.g. "94:6".
 */
export async function fetchVerseByKey(verseKey, translationId = 131) {
  if (!isQuranApiConfigured()) return null;

  const token = await getAccessToken();
  const { apiBase } = getEndpoints();

  const url = `${apiBase}/verses/by_key/${encodeURIComponent(verseKey)}?fields=text_uthmani&translations=${translationId}&audio=7`;
  const res = await fetch(url, {
    headers: {
      "x-auth-token": token,
      "x-client-id": process.env.QURAN_CLIENT_ID,
    },
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Quran API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const verse = data?.verse;
  if (!verse) return null;

  return {
    verseKey: verse.verse_key,
    arabic: verse.text_uthmani,
    translation: stripHtmlTags(verse.translations?.[0]?.text || ""),
    translator: verse.translations?.[0]?.resource_name || "Dr. Mustafa Khattab, The Clear Quran",
    audioUrl: resolveAudioUrl(verse.audio, verse.verse_key),
    verified: true,
  };
}

/**
 * Fetches Tafsir (default: Ibn Kathir Abridged, ID 169) for a specific verseKey.
 */
export async function fetchTafsirByKey(verseKey, tafsirId = 169) {
  if (!isQuranApiConfigured()) return null;

  const token = await getAccessToken();
  const { apiBase } = getEndpoints();

  const url = `${apiBase}/tafsirs/${tafsirId}/by_ayah/${encodeURIComponent(verseKey)}`;
  const res = await fetch(url, {
    headers: {
      "x-auth-token": token,
      "x-client-id": process.env.QURAN_CLIENT_ID,
    },
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Quran Tafsir error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const tafsir = data?.tafsir;
  if (!tafsir?.text) return null;

  return {
    verseKey,
    resourceName: tafsir.resource_name || "Tafsir Ibn Kathir",
    text: stripHtmlTags(tafsir.text),
  };
}

/**
 * Extracts a Surah:Ayah key (e.g. "94:6" or "13:28") from AI reflection text.
 */
export function extractVerseKey(text = "") {
  // Match explicit numeric verse keys like 94:6, 13:28, or 94:5-6 (takes first ayah)
  const directMatch = text.match(/\b(\d{1,3}):(\d{1,3})(?:\s*[-–]\s*\d{1,3})?\b/);
  if (directMatch) {
    const surah = Number(directMatch[1]);
    const ayah = Number(directMatch[2]);
    if (surah >= 1 && surah <= 114 && ayah >= 1) {
      return `${surah}:${ayah}`;
    }
  }

  // Fallback: match Surah name + chapter:verse or verse
  const lower = text.toLowerCase();
  for (const [name, num] of Object.entries(SURAH_NAME_TO_NUMBER)) {
    const idx = lower.indexOf(name);
    if (idx !== -1) {
      const after = lower.slice(idx + name.length, idx + name.length + 20);
      const ayahMatch = after.match(/(?:ayah|verse|:|\s)\s*(\d{1,3})/i);
      if (ayahMatch) {
        return `${num}:${ayahMatch[1]}`;
      }
    }
  }

  return null;
}

/**
 * Returns a mood-appropriate Ayah of the Day, using Quran Foundation API if configured,
 * or falling back cleanly to curated local verse data.
 */
export async function getMoodAyah(mood = "neutral") {
  const normalizedMood = MOOD_ALIASES[mood] || mood;
  const list = CURATED_MOOD_VERSES[normalizedMood] || CURATED_MOOD_VERSES.neutral;
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const picked = list[dayIndex % list.length];

  if (isQuranApiConfigured()) {
    try {
      const live = await fetchVerseByKey(picked.key);
      if (live) {
        return {
          ...live,
          translation: live.translation || picked.translation,
          source: picked.source,
          theme: picked.theme,
        };
      }
    } catch (err) {
      console.warn("⚠️ Quran Foundation API fallback triggered:", err.message);
    }
  }

  return {
    verseKey: picked.key,
    source: picked.source,
    theme: picked.theme,
    arabic: picked.arabic,
    translation: picked.translation,
    audioUrl: buildFallbackAudioUrl(picked.key),
    verified: false,
  };
}
