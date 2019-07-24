import { parse, stringify, prettyPrint } from './chordpro.js';

const chordMagic = window.chordMagic;

const $in = document.getElementById('in');
const $out = document.getElementById('out');
const $steps = document.getElementById('steps');

$in.addEventListener('keyup', () => {
  $out.value = parseAndTranspose($in.value);
});

function parseAndTranspose(text) {
  const steps = parseInt($steps.value, 10);
  const tokens = parse(text);

  const transposedTokens = tokens.map((token) => {
    if (token.type === 'chord') {
      try {
        const chord = chordMagic.parse(token.value);
        const transposedChord = chordMagic.transpose(chord, steps);
        return {
          ...token,
          value: chordMagic.prettyPrint(transposedChord),
        };
      } catch(e) {
        return token;
      }
    }
    return token;
  });

  console.log(transposedTokens);

  const chordPro = stringify(transposedTokens);
  return prettyPrint(chordPro);
}
