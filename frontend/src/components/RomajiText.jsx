import { useSelector } from "react-redux";
import { romajiMapping } from "../utils/romajiMapping";

const macronMap = {
  a: "ā",
  i: "ī",
  u: "ū",
  e: "ē",
  o: "ō",
  A: "Ā",
  I: "Ī",
  U: "Ū",
  E: "Ē",
  O: "Ō",
};

const RomajiText = ({ text }) => {
  const { romajiEnabled } = useSelector((state) => state.settings);

  if (!text || !romajiEnabled) {
    return <>{text}</>;
  }

  const processText = (input) => {
    const result = [];
    let i = 0;

    while (i < input.length) {
      const currentChar = input[i];
      const nextChar = input[i + 1] || "";
      const combinedChars = currentChar + nextChar;

      if ((currentChar === "っ" || currentChar === "ッ") && nextChar) {
        const nextRomaji = romajiMapping[nextChar];
        if (nextRomaji && /^[bcdfghjklmnpqrstvwxyz]/i.test(nextRomaji[0])) {
          const sokuonRomaji = nextRomaji[0] + nextRomaji;
          result.push(renderSpan(sokuonRomaji, currentChar + nextChar));
          i += 2;
          continue;
        }
      }

      const longVowel = checkLongVowel(input, i);
      if (longVowel) {
        result.push(renderSpan(longVowel.romaji, longVowel.chars));
        i += longVowel.length;
        continue;
      }

      if (romajiMapping[combinedChars]) {
        result.push(renderSpan(romajiMapping[combinedChars], combinedChars));
        i += 2;
        continue;
      }

      result.push(renderSpan(romajiMapping[currentChar], currentChar));
      i++;
    }

    return result;
  };

  const checkLongVowel = (input, index) => {
    const current = input[index];
    const next = input[index + 1] || "";

    const hiraganaLong = {
      あ: ["あ"],
      い: ["い"],
      う: ["う"],
      え: ["い", "え"],
      お: ["う", "お"],
    };

    const katakanaVowels = { ア: "a", イ: "i", ウ: "u", エ: "e", オ: "o" };

    if (hiraganaLong[current]?.includes(next)) {
      const base = romajiMapping[current];
      return {
        romaji: macronMap[base],
        chars: current + next,
        length: 2,
      };
    }

    if (katakanaVowels[current] && next === "ー") {
      const base = katakanaVowels[current];
      return {
        romaji: macronMap[base],
        chars: current + next,
        length: 2,
      };
    }

    return null;
  };

  const renderSpan = (romaji, characters) => (
    <span
      key={`${characters}-${Math.random()}`}
      className="relative inline-block"
    >
      {romaji && (
        <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-[10px] text-[var(--color-muted)] opacity-70">
          {romaji}
        </span>
      )}
      {characters}
    </span>
  );

  return <>{processText(text)}</>;
};

export default RomajiText;
