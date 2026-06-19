const NAME_PARTICLES = new Set([
  "de",
  "da",
  "dos",
  "das",
  "do",
  "van",
  "von",
  "del",
  "la",
  "le",
  "di",
]);

const COMMON_MIDDLE_NAMES = new Set([
  "joseph",
  "james",
  "john",
  "mark",
  "wayne",
  "leonardo",
  "angelo",
  "gana",
  "gerard",
  "antonio",
  "alejandro",
  "armando",
  "obinze",
  "fane",
  "sebastián",
  "sebastian",
]);

function getLastWord(name) {
  if (!name) return "";
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

function looksLikeSpanishSecondSurname(word) {
  return /(?:ez|az|iz|oz|uz|es|as|is)$/i.test(word);
}

/**
 * Infer a pitch label from a full legal name when no nickname exists.
 */
function inferShortNameFromFullName(fullName) {
  if (!fullName) return "";
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 2) return getLastWord(fullName);

  if (parts.length === 3) {
    const middle = parts[1];
    if (COMMON_MIDDLE_NAMES.has(middle.toLowerCase())) {
      return parts[2];
    }
    if (looksLikeSpanishSecondSurname(parts[2])) {
      return parts[1];
    }
    return parts[2];
  }

  let end = parts.length - 1;
  while (end > 0 && NAME_PARTICLES.has(parts[end].toLowerCase())) {
    end -= 1;
  }

  const last = parts[end];
  const secondLast = end > 0 ? parts[end - 1] : last;

  if (NAME_PARTICLES.has(secondLast.toLowerCase())) {
    return parts[0] ?? last;
  }

  if (looksLikeSpanishSecondSurname(last)) {
    return secondLast;
  }

  return last;
}

/**
 * Short label for lineup markers. Prefers StatsBomb player_nickname when available.
 * @param {string} fullName - player.name from events
 * @param {string|null|undefined} nickname - player_nickname from lineups API
 */
export default function getPlayerShortName(fullName, nickname) {
  const nick = nickname?.trim();
  if (nick) return getLastWord(nick);

  return inferShortNameFromFullName(fullName);
}
