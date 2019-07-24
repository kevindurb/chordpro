const tokenRegex = /(\[[\w\d]+\])|([\w\d\s]+)/g;
const chordRegex = /(\[[\w\d]+\])/g;

const isChord = (value) => value && value.startsWith('[');

const stripChord = (chord) => chord.replace('[', '').replace(']', '');

const parseToken = (value) => {
  if (isChord(value)) {
    return {
      type: 'chord',
      value: stripChord(value),
    };
  } else {
    return {
      type: 'text',
      value,
    };
  }
};

export const parse = (text) => {
  const cleanText = `${text}`.trim();
  const unparsedTokens = Array.from(cleanText.match(tokenRegex)).flat();
  return unparsedTokens.map(parseToken);
};

export const stringify = (tokenList) => {
  return tokenList.reduce((result, token) => {
    if (token.type === 'chord') {
      return result + `[${token.value}]`;
    }
    return result + token.value;
  }, '');
}

export const prettyPrint = (chordPro) => {
  const lines = chordPro.split('\n');
  return lines.reduce((result, line) => {
    if (chordRegex.test(line)) {
      const chords = Array.from(line.match(chordRegex)).flat();
      let chordSum = '';
      const chordLine = chords.reduce((resultLine, chord) => {
        const chordIndex = line.indexOf(chord, resultLine.length);
        const fill = Array(chordIndex - resultLine.length - chordSum.length).fill(' ').join('');
        chordSum += chord;
        return resultLine + fill + stripChord(chor);
      }, '');
      const lyricsLine = line.replace(chordRegex, '');
      return result + '\n' + chordLine + '\n' + lyricsLine;
    }
    return result + '\n' + line;
  }, '');
}
