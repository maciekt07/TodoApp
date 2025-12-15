import i18n from "../i18n/config";

const hoursLeft = 24 - new Date().getHours();

export const maxRecentGreetings = 8; // Number of recent greetings to track per language

// Track recent indices per language to avoid repeating greetings
const recentGreetingsPerLang: Map<string, number[]> = new Map();

/**
 * Returns a random greeting message using i18n `greetings.list`.
 * It avoids recently shown greetings per language.
 */
export const getRandomGreeting = (): string => {
  const lang = i18n.language || i18n.options.lng || "en";

  // Get greetings list from translations. returnObjects allows arrays to be returned.
  const list = i18n.t("greetings.list", { returnObjects: true }) as string[] | undefined;

  if (!Array.isArray(list) || list.length === 0) {
    // Fallback to a simple localized greeting
    return i18n.t("greetings.morning");
  }

  // Build interpolation values
  const weekday = new Date().toLocaleDateString(lang.startsWith("zh") ? "zh-CN" : "en", {
    weekday: "long",
  });
  const month = new Date().toLocaleDateString(lang.startsWith("zh") ? "zh-CN" : "en", {
    month: "long",
  });

  const hoursLeftText = hoursLeft > 4 ? `${hoursLeft}` : `${hoursLeft}`;

  // Ensure recent list exists
  if (!recentGreetingsPerLang.has(lang)) {
    recentGreetingsPerLang.set(lang, []);
  }

  const recent = recentGreetingsPerLang.get(lang)!;

  // Pick a random index not in recent (with a fallback after attempts)
  let randomIndex = 0;
  const maxAttempts = 10;
  let attempts = 0;
  do {
    randomIndex = Math.floor(Math.random() * list.length);
    attempts += 1;
    if (attempts >= maxAttempts) break;
  } while (recent.includes(randomIndex) && recent.length < list.length);

  // Update recent history for this language
  recent.push(randomIndex);
  if (recent.length > maxRecentGreetings) {
    recent.shift();
  }
  recentGreetingsPerLang.set(lang, recent);

  // Return interpolated string using i18n to process placeholders
  return i18n.t(`greetings.list.${randomIndex}`, {
    weekday,
    month,
    hoursLeft: hoursLeftText,
  });
};
