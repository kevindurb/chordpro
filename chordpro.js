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

const buildChordLine = (line) => {
  const chords = Array.from(line.match(chordRegex) || []).flat();
  let chordSum = '';
  return chords.reduce((resultLine, chord) => {
    const chordIndex = line.indexOf(chord, resultLine.length);
    const fill = Array(chordIndex - resultLine.length - chordSum.length).fill(' ').join('');
    chordSum += chord;
    return resultLine + fill + stripChord(chord);
  }, '');
};

export const parse = (text) => {
  const cleanText = `${text}`.trim();
  const unparsedTokens = Array.from(cleanText.match(tokenRegex) || []).flat();
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
    const chordLine = buildChordLine(line);
    const lyricsLine = line.replace(chordRegex, '');
    return [
      ...result,
      chordLine,
      lyricsLine,
    ];
  }, []).join('\n');
}
