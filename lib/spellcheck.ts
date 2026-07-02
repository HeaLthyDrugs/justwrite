export interface SpellCheckSegment {
  text: string;
  misspelled: boolean;
}

const COMMON_WORDS_SOURCE = `
a able about above accept account across act action actually add after again against age ago air all almost alone along already also
although always am among an and another answer any anyone anything are area around as ask asked asking at away back bad be because become
been before began begin being best better between big bit body book both bring build business but by call called came can cannot care
case change check child children city close come common company complete continue could country course create created current day days dear
decide did different do does doing done down during each early easy edit effect either end enough every everything example experience fact
family far fast feel few file final find first flow focus follow for form found from full further game gave get getting give given go good
got great group grow had hand happen hard has have he head help her here high him his home hour how however idea if important in include
inside instead interest into is issue it its just keep kind know known language large last later learn leave left less let life light like
line list little live local long look made make making many may me mean might minute more most move much must my name near need never new
next no note notes now number of off often old on once one only open option or order other our out over own page panel part people place
plan play point possible problem product public put question quick read real really right room run said same save say scene search second
see seem select set setting settings several she short should show side simple since small so some something sound spell spellcheck stable
start state still style such sure system take tell test text than that the their them then there these they thing think this those through
time to today together too tool true try turn type typing under until up update use used user using value very view want was way we well
went were what when where which while who why will with without word words work working world would write writer writing wrong you your
markdown preview export import offline online private browser editor textarea audio ambient background volume keyboard typo typos highlight
highlighted highlights drawer sidebar picker click hover cursor pointer focus close open enabled disabled toggle local first app justwrite
roopesh distracting overlap noisy regular feature control choose choice selected selection
`;

const COMMON_WORDS = new Set(
  COMMON_WORDS_SOURCE.trim().split(/\s+/).map((word) => word.toLowerCase())
);

const ACCEPTED_CONTRACTION_SUFFIXES = new Set([
  "d",
  "ll",
  "m",
  "re",
  "s",
  "t",
  "ve",
]);

const IGNORED_RANGE_PATTERNS = [
  /`[^`\n]*`/g,
  /```[\s\S]*?```/g,
  /https?:\/\/\S+/g,
  /www\.\S+/g,
  /\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g,
  /\[[^\]]*\]\([^)]+\)/g,
];

function getIgnoredRanges(text: string) {
  const ranges: Array<[number, number]> = [];

  for (const pattern of IGNORED_RANGE_PATTERNS) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text))) {
      ranges.push([match.index, match.index + match[0].length]);
    }
  }

  return ranges;
}

function isInsideRanges(index: number, ranges: Array<[number, number]>) {
  return ranges.some(([start, end]) => index >= start && index < end);
}

function normalizeWord(word: string) {
  return word
    .toLowerCase()
    .replace(/^'+|'+$/g, "")
    .replace(/'s$/, "");
}

function hasKnownRoot(word: string) {
  const suffixes = ["ing", "ed", "ly", "er", "est", "ness", "ment", "able", "ful", "s"];

  return suffixes.some((suffix) => {
    if (!word.endsWith(suffix) || word.length <= suffix.length + 2) {
      return false;
    }

    const root = word.slice(0, -suffix.length);
    return COMMON_WORDS.has(root) || COMMON_WORDS.has(`${root}e`);
  });
}

function shouldIgnoreToken(rawWord: string) {
  if (rawWord.length <= 2) {
    return true;
  }

  if (/^\d/.test(rawWord) || /\d/.test(rawWord)) {
    return true;
  }

  if (rawWord.includes("_") || rawWord.includes("/")) {
    return true;
  }

  if (/[a-z][A-Z]/.test(rawWord)) {
    return true;
  }

  if (rawWord === rawWord.toUpperCase() && rawWord.length <= 6) {
    return true;
  }

  return false;
}

function isKnownWord(rawWord: string) {
  if (shouldIgnoreToken(rawWord)) {
    return true;
  }

  const word = normalizeWord(rawWord);
  if (!word || word.length <= 2) {
    return true;
  }

  if (COMMON_WORDS.has(word) || hasKnownRoot(word)) {
    return true;
  }

  const contraction = word.match(/^([a-z]+)'([a-z]+)$/);
  if (contraction) {
    const [, root, suffix] = contraction;
    return COMMON_WORDS.has(root) && ACCEPTED_CONTRACTION_SUFFIXES.has(suffix);
  }

  return false;
}

export function getSpellCheckSegments(text: string): SpellCheckSegment[] {
  if (!text) {
    return [{ text: "", misspelled: false }];
  }

  if (text.length > 30000) {
    return [{ text, misspelled: false }];
  }

  const ignoredRanges = getIgnoredRanges(text);
  const segments: SpellCheckSegment[] = [];
  const wordPattern = /[A-Za-z]+(?:'[A-Za-z]+)?/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = wordPattern.exec(text))) {
    const word = match[0];
    const start = match.index;
    const end = start + word.length;

    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), misspelled: false });
    }

    const misspelled = !isInsideRanges(start, ignoredRanges) && !isKnownWord(word);
    segments.push({ text: word, misspelled });
    cursor = end;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), misspelled: false });
  }

  return segments;
}
