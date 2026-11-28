// server/sunnahService.js
// Curated, reference-verified Prophetic Sunnah acts, Hadiths, and Asmā’ullāh al-Ḥusnā
// dynamically matched to both mood and journal content.

const SUNNAH_LIBRARY = {
  anxiety: [
    {
      id: "bukhari-6369",
      keywords: ["worry", "worried", "anxious", "stress", "debt", "money", "future", "overwhelmed", "afraid", "fear", "lazy", "laziness", "procrastinat"],
      title: "Prophetic Du‘ā’ Against Worry, Laziness & Debt",
      action: "Recite this Prophetic supplication slowly with presence of heart, handing your worry (Hamm) and grief (Ḥazan) back to Allah.",
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
      transliteration: "Allāhumma innī a‘ūdhu bika minal-hammi wal-ḥazan, wal-‘ajzi wal-kasal, wal-bukhli wal-jubn, wa ḍala‘id-dayni wa ghalabatir-rijāl.",
      translation: "O Allah, I seek refuge in You from worry and grief, from helplessness and laziness, from miserliness and cowardice, and from being overwhelmed by debt and by people.",
      source: "Sahih al-Bukhari 6369",
    },
    {
      id: "abudawud-1319",
      keywords: ["deadline", "chest", "tight", "distress", "matter", "pressure", "panic", "work", "exam", "pray", "salah"],
      title: "Hastening to Two Rak‘ahs of Ṣalāh",
      action: "Stand for two quiet rak‘ahs of prayer. Whenever a matter distressed the Prophet ﷺ, he turned immediately to Ṣalāh for relief.",
      arabic: "كَانَ النَّبِيُّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ إِذَا حَزَبَهُ أَمْرٌ صَلَّى",
      transliteration: "Kāna an-Nabiyyu ﷺ idhā ḥazabahu amrun ṣallā.",
      translation: "Whenever a matter distressed the Prophet ﷺ, he would hasten to prayer.",
      source: "Sunan Abi Dawud 1319 (Hasan)",
    },
    {
      id: "muslim-2664",
      keywords: ["effort", "enough", "fail", "failing", "plan", "control", "outcome", "strength", "weak", "job", "career", "study"],
      title: "Striving With Reliance on Allah (Ista‘in Billāh)",
      action: "Do what is within your reach and say 'Qaddarallāhu wa mā shā’a fa‘al', trusting Allah with the outcome rather than drowning in 'what ifs'.",
      arabic: "احْرِصْ عَلَى مَا يَنْفَعُكَ وَاسْتَعِنْ بِاللَّهِ وَلَا تَعْجَزْ",
      transliteration: "Iḥriṣ ‘alā mā yanfa‘uka wasta‘in billāhi wa lā ta‘jaz.",
      translation: "Be eager for what benefits you, seek help from Allah, and do not give up.",
      source: "Sahih Muslim 2664",
    },
    {
      id: "bukhari-4563",
      keywords: ["afraid", "fear", "people", "threat", "uncertain", "alone", "crisis"],
      title: "Declaring ḤasbunAllāhu wa Ni‘mal-Wakīl",
      action: "Say 'ḤasbunAllāhu wa ni‘mal-Wakīl' intentionally, remembering that Ibrāhīm (AS) and the Prophet ﷺ spoke it in moments of intense fear.",
      arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
      transliteration: "ḤasbunAllāhu wa ni‘mal-Wakīl.",
      translation: "Allah is sufficient for us, and He is the best Disposer of affairs.",
      source: "Sahih al-Bukhari 4563",
    },
  ],

  grief: [
    {
      id: "muslim-918",
      keywords: ["loss", "lost", "died", "death", "miss", "broken", "pain", "hurt", "trial", "calamity", "hardship"],
      title: "The Du‘ā’ of Istirjā‘ in Loss & Hardship",
      action: "Whisper the Prophetic Istirjā‘ and ask Allah to reward your patience and replace what hurts with something better.",
      arabic: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا",
      transliteration: "Innā lillāhi wa innā ilayhi rāji‘ūn. Allāhumma’jurnī fī muṣībatī wa akhlif lī khayran minhā.",
      translation: "Indeed we belong to Allah and to Him we shall return. O Allah, reward me in my affliction and replace it for me with something better.",
      source: "Sahih Muslim 918",
    },
    {
      id: "bukhari-1303",
      keywords: ["cry", "crying", "tears", "weep", "grief", "sad", "heavy", "heartbreak", "sorrow"],
      title: "Merciful Tears Without Despair",
      action: "Do not suppress gentle tears; honor your grief while keeping your tongue pleasing to Allah, just as the Prophet ﷺ wept for his son Ibrāhīm.",
      arabic: "تَدْمَعُ الْعَيْنُ وَيَحْزَنُ الْقُلْبُ وَلَا نَقُولُ إِلَّا مَا يَرْضَى رَبُّنَا",
      transliteration: "Tadma‘ul-‘aynu wa yaḥzanul-qalbu wa lā naqūlu illā mā yarḍā Rabbunā.",
      translation: "The eyes shed tears and the heart grieves, yet we say only that which pleases our Lord.",
      source: "Sahih al-Bukhari 1303 · Sahih Muslim 2315",
    },
  ],

  anger: [
    {
      id: "bukhari-3282",
      keywords: ["angry", "anger", "furious", "mad", "snap", "argument", "irritated", "frustrated", "rage"],
      title: "Seeking Refuge From Shayṭān’s Provocation",
      action: "Pause before replying and say 'A‘ūdhu billāhi minash-shayṭānir-rajīm'—the exact Prophetic cure for boiling anger.",
      arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
      transliteration: "A‘ūdhu billāhi minash-shayṭānir-rajīm.",
      translation: "I seek refuge in Allah from the accursed Shayṭān.",
      source: "Sahih al-Bukhari 3282 · Sahih Muslim 2610",
    },
    {
      id: "abudawud-4782",
      keywords: ["stand", "standing", "shout", "yell", "temper", "calm", "body", "reaction"],
      title: "Lowering Your Posture to Cool Anger",
      action: "If you are standing while angry, sit down; if anger persists, lie down—breaking the physical surge of Ghaḍab as taught by the Prophet ﷺ.",
      arabic: "إِذَا غَضِبَ أَحَدُكُمْ وَهُوَ قَائِمٌ فَلْيَجْلِسْ، فَإِنْ ذَهَبَ عَنْهُ الْغَضَبُ وَإِلَّا فَلْيَضْطَجِعْ",
      transliteration: "Idhā ghaḍiba aḥadukum wa huwa qā’imun falyajlis...",
      translation: "When one of you becomes angry while standing, let him sit down; if the anger leaves him, well and good; otherwise let him lie down.",
      source: "Sunan Abi Dawud 4782 (Sahih)",
    },
  ],

  loneliness: [
    {
      id: "muslim-482",
      keywords: ["alone", "lonely", "unheard", "nobody", "isolated", "distant", "dua", "sujud", "prayer"],
      title: "Pouring Out Your Heart in Sujūd",
      action: "Make Wuḍū’ and lengthen your prostration (Sujūd), speaking to Allah privately—for the servant is never closer to his Lord than in Sujūd.",
      arabic: "أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ فَأَكْثِرُوا الدُّعَاءَ",
      transliteration: "Aqrabu mā yakūnul-‘abdu min Rabbihi wa huwa sājidun fa-akthirud-du‘ā’.",
      translation: "The closest a servant is to his Lord is while in prostration, so increase in supplication.",
      source: "Sahih Muslim 482",
    },
    {
      id: "tirmidhi-2457",
      keywords: ["worry", "isolated", "heart", "salawat", "comfort", "peace"],
      title: "Sending Abundant Ṣalawāt Upon the Prophet ﷺ",
      action: "Spend two quiet minutes sending Ṣalawāt upon the Prophet ﷺ—which suffices for a believer’s worries and softens isolation.",
      arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
      transliteration: "Allāhumma ṣalli ‘alā Muḥammadin wa ‘alā āli Muḥammad.",
      translation: "O Allah, send peace and blessings upon Muḥammad and the family of Muḥammad.",
      source: "Jami‘ at-Tirmidhi 2457 (Hasan Sahih)",
    },
  ],

  guilt: [
    {
      id: "abudawud-1521",
      keywords: ["sin", "missed", "prayer", "pray", "wudu", "ashamed", "embarrassed", "guilt", "repent", "tawbah", "forgive", "slip"],
      title: "Two Rak‘ahs of Ṣalāt at-Tawbah",
      action: "Perform Wuḍū’ carefully, pray two quiet rak‘ahs, and ask Allah’s forgiveness—the Prophet ﷺ promised Allah forgives the servant who turns back this way.",
      arabic: "مَا مِنْ رَجُلٍ يُذْنِبُ ذَنْبًا ثُمَّ يَقُومُ فَيَتَطَهَّرُ ثُمَّ يُصَلِّي ثُمَّ يَسْتَغْفِرُ اللَّهَ إِلَّا غَفَرَ اللَّهُ لَهُ",
      transliteration: "Mā min rajulin yudhni-bu dhanban thumma yaqūmu fayataṭahharu thumma yuṣallī thumma yastaghfirullāha illā ghafarallāhu lah.",
      translation: "No servant commits a sin, then purifies himself, prays two rak‘ahs, and seeks Allah’s forgiveness, except that Allah forgives him.",
      source: "Sunan Abi Dawud 1521 · Jami‘ at-Tirmidhi 406 (Sahih)",
    },
    {
      id: "tirmidhi-1987",
      keywords: ["scroll", "scrolling", "wasted", "phone", "time", "mistake", "habit", "relapse", "bad", "good"],
      title: "Following a Slip With a Good Deed",
      action: "Follow your slip immediately with a quiet good deed—a hidden charity, a kind word, or 'SubḥānAllāhi wa biḥamdihi'—to wipe out the trace on your heart.",
      arabic: "وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا",
      transliteration: "Wa atbi‘is-sayyi’atal-ḥasanata tamḥuhā.",
      translation: "And follow up a bad deed with a good deed; it will wipe it out.",
      source: "Jami‘ at-Tirmidhi 1987 (Hasan Sahih)",
    },
  ],

  fatigue: [
    {
      id: "bukhari-4205",
      keywords: ["tired", "exhausted", "drained", "burnout", "energy", "strength", "weak", "numb", "heavy"],
      title: "Drawing Strength From Lā Ḥawla wa Lā Quwwata Illā Billāh",
      action: "When drained, repeat 'Lā ḥawla wa lā quwwata illā billāh'—recognizing that all strength to endure or change comes solely from Allah.",
      arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      transliteration: "Lā ḥawla wa lā quwwata illā billāh.",
      translation: "There is no might nor power except through Allah (a treasure from the treasures of Paradise).",
      source: "Sahih al-Bukhari 4205 · Sahih Muslim 2704",
    },
    {
      id: "bukhari-6464",
      keywords: ["consistent", "consistency", "routine", "small", "overwhelmed", "dry", "numb", "habit"],
      title: "One Small, Steady Deed (Istiqāmah)",
      action: "Do not overwhelm yourself today—choose one tiny, sincere act of worship (even 3 minutes of Qur’an or Dhikr) and guard its consistency.",
      arabic: "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
      transliteration: "Aḥabbul-a‘māli ilallāhi adwamuhā wa in qall.",
      translation: "The most beloved deeds to Allah are those done consistently, even if they are small.",
      source: "Sahih al-Bukhari 6464 · Sahih Muslim 783",
    },
    {
      id: "tirmidhi-3524",
      keywords: ["stuck", "help", "mercy", "handle", "myself", "collapse", "overwhelmed"],
      title: "Calling Upon the Ever-Living for Help",
      action: "Whisper 'Yā Ḥayyu yā Qayyūm bi-raḥmatika astaghīth'—handing over every affair you feel too weak to carry.",
      arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
      transliteration: "Yā Ḥayyu yā Qayyūmu bi-raḥmatika astaghīth, aṣliḥ lī sha’nī kullahu wa lā takilnī ilā nafsī ṭarfata ‘ayn.",
      translation: "O Ever-Living, O Sustainer, in Your mercy I seek relief; set right all my affairs and do not leave me to myself even for the blink of an eye.",
      source: "Jami‘ at-Tirmidhi 3524 (Hasan)",
    },
  ],

  gratitude: [
    {
      id: "ibnmajah-3803",
      keywords: ["blessed", "blessing", "answered", "relief", "eased", "happy", "grateful", "alhamdulillah", "good"],
      title: "Sealing Blessings With Prophetic Praise",
      action: "Pause to thank Allah explicitly with the words the Prophet ﷺ said whenever something pleased him, attributing the blessing wholly to Him.",
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ",
      transliteration: "Alḥamdulillāhilladhī bini‘matihi tatimmus-ṣāliḥāt.",
      translation: "All praise is for Allah by whose favor good things are completed.",
      source: "Sunan Ibn Majah 3803 (Sahih)",
    },
    {
      id: "tirmidhi-1954",
      keywords: ["friend", "family", "mother", "father", "spouse", "person", "people", "helped", "kind"],
      title: "Thanking Allah by Thanking Someone Today",
      action: "Send a sincere message or make Du‘ā’ for someone Allah used as a means of good in your life today.",
      arabic: "مَنْ لَا يَشْكُرُ النَّاسَ لَا يَشْكُرُ اللَّهَ",
      transliteration: "Man lā yashkurin-nāsa lā yashkurullāh.",
      translation: "Whoever does not thank people has not thanked Allah.",
      source: "Jami‘ at-Tirmidhi 1954 (Sahih)",
    },
    {
      id: "abudawud-2774",
      keywords: ["joy", "news", "relieved", "sujud", "humble", "prostrate", "grateful"],
      title: "Sujūd ash-Shukr (Prostration of Gratitude)",
      action: "Fall into a single brief prostration of gratitude (Sujūd ash-Shukr) to thank Allah humbly for this blessing or ease.",
      arabic: "كَانَ إِذَا أَتَاهُ أَمْرٌ يَسُرُّهُ خَرَّ سَاجِدًا شُكْرًا لِلَّهِ",
      transliteration: "Kāna idhā atāhu amrun yasurruhu kharra sājidan shukran lillāh.",
      translation: "Whenever something came to the Prophet ﷺ that pleased him, he would fall down in prostration in gratitude to Allah.",
      source: "Sunan Abi Dawud 2774 (Sahih)",
    },
  ],
};

const NAMES_OF_ALLAH = [
  {
    name: "Ar-Razzāq",
    meaning: "The Constant Provider",
    keywords: ["money", "debt", "job", "work", "income", "provision", "rizq", "rent", "bills", "career", "deadline"],
    moods: [],
    whenToUse: "When worrying about provision, livelihood, work, or deadlines.",
  },
  {
    name: "At-Tawwāb",
    meaning: "The Ever-Accepting of Repentance",
    keywords: ["sin", "guilt", "ashamed", "embarrassed", "missed", "prayer", "scroll", "wasted", "slip", "repent", "forgive"],
    moods: ["Guilty", "Ashamed"],
    whenToUse: "When feeling guilt over a slip-up or wanting to return sincerely to Allah.",
  },
  {
    name: "Al-Jabbār",
    meaning: "The Mender of Broken Hearts",
    keywords: ["broken", "heartbreak", "grief", "loss", "died", "hurt", "betrayed", "cry", "tears"],
    moods: ["Grieving", "Heartbroken", "Sad"],
    whenToUse: "When grieving, heartbroken, or carrying deep emotional pain.",
  },
  {
    name: "Al-Qarīb",
    meaning: "The Ever-Near",
    keywords: ["alone", "lonely", "distant", "unheard", "nobody", "isolated", "far"],
    moods: ["Lonely"],
    whenToUse: "When feeling isolated, unheard, or distant from Allah or people.",
  },
  {
    name: "Al-Wakīl",
    meaning: "The Best Disposer of Affairs",
    keywords: ["control", "plan", "uncertain", "future", "afraid", "worry", "anxious", "outcome", "stress"],
    moods: ["Anxious", "Overwhelmed", "Doubtful", "Al-Qalaq"],
    whenToUse: "When trying to control outcomes or feeling overwhelmed by uncertainty.",
  },
  {
    name: "Al-Ḥalīm",
    meaning: "The Most Forbearing & Gentle",
    keywords: ["angry", "anger", "frustrated", "mad", "temper", "annoyed", "argument", "unfair"],
    moods: ["Frustrated", "Angry"],
    whenToUse: "When struggling with anger, irritation, or conflict with others.",
  },
  {
    name: "Al-Qawiyy",
    meaning: "The All-Strong",
    keywords: ["tired", "exhausted", "weak", "drained", "burnout", "energy", "numb"],
    moods: ["Exhausted", "Tired", "Numb"],
    whenToUse: "When physically or spiritually drained and out of strength.",
  },
  {
    name: "Ash-Shakūr",
    meaning: "The Most Appreciative",
    keywords: ["grateful", "thankful", "blessed", "alhamdulillah", "eased", "relief", "answered", "joy"],
    moods: ["Grateful", "Happy", "Serene", "Calm", "Inspired", "Content", "Hopeful", "Sakīnah", "Al-Basṭ"],
    whenToUse: "When thanking Allah for ease, relief, or even small unnoticed efforts.",
  },
];

const MOOD_TO_SUNNAH_BUCKET = {
  Anxious: "anxiety",
  Overwhelmed: "anxiety",
  Doubtful: "anxiety",
  "Al-Qalaq": "anxiety",
  Grieving: "grief",
  Sad: "grief",
  Heartbroken: "grief",
  Hopeless: "grief",
  "Al-Qabḍ": "grief",
  Frustrated: "anger",
  Angry: "anger",
  Lonely: "loneliness",
  Guilty: "guilt",
  Ashamed: "guilt",
  Exhausted: "fatigue",
  Tired: "fatigue",
  Numb: "fatigue",
  Restless: "fatigue",
  Grateful: "gratitude",
  Happy: "gratitude",
  Serene: "gratitude",
  Calm: "gratitude",
  Inspired: "gratitude",
  Content: "gratitude",
  Hopeful: "gratitude",
  "Sakīnah": "gratitude",
  "Al-Basṭ": "gratitude",
};

/**
 * Dynamically scores and selects the best 2–3 verified Prophetic Sunnah options
 * matching BOTH the user's journal text and their logged mood.
 */
export function getVerifiedSunnahForMood(mood = "neutral", journal = "") {
  const bucket = MOOD_TO_SUNNAH_BUCKET[mood] || "anxiety";
  const lowerJournal = String(journal || "").toLowerCase();

  const allItems = Object.entries(SUNNAH_LIBRARY).flatMap(([b, items]) =>
    items.map((item) => {
      const keywordHits = (item.keywords || []).reduce(
        (sum, kw) => (lowerJournal.includes(kw) ? sum + 3 : sum),
        0
      );
      const moodBonus = b === bucket ? 2 : 0;
      return { item, score: keywordHits + moodBonus };
    })
  );

  allItems.sort((a, b) => b.score - a.score);
  const top = allItems.slice(0, 3).map((entry) => entry.item);
  return top.length ? top : SUNNAH_LIBRARY[bucket] || SUNNAH_LIBRARY.anxiety;
}

/**
 * Dynamically selects the most fitting Name of Allah (Asmā’ullāh al-Ḥusnā)
 * based on the journal content and mood, so the AI uses it only when relevant.
 */
export function getMatchedNameOfAllah(mood = "neutral", journal = "") {
  const lowerJournal = String(journal || "").toLowerCase();
  let best = NAMES_OF_ALLAH[4]; // Al-Wakīl default
  let bestScore = -1;

  for (const entry of NAMES_OF_ALLAH) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lowerJournal.includes(kw)) score += 3;
    }
    if (entry.moods.includes(mood)) score += 2;
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return best;
}

/**
 * Matches the AI's reflection text back to the exact verified Sunnah object
 * from the dynamic candidate pool so the UI displays the exact Hadith badge & Arabic.
 */
export function matchVerifiedSunnah(mood = "neutral", reflectionText = "", journal = "") {
  const candidates = getVerifiedSunnahForMood(mood, journal);
  const lower = String(reflectionText || "").toLowerCase();

  const matched = candidates.find((s) => {
    const numberMatch = s.source.match(/\b\d{3,5}\b/);
    if (numberMatch && lower.includes(numberMatch[0])) return true;
    const baseSource = s.source.replace(/\([^)]*\)/g, "").split("·")[0].trim().toLowerCase();
    return (baseSource && lower.includes(baseSource)) || lower.includes(s.title.toLowerCase());
  });

  return matched || candidates[0] || null;
}
