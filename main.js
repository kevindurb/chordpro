import { parse, stringify, prettyPrint } from './chordpro.js';

const LINE_PADDING = 1;
const FONT_SIZE = 12;

const chordMagic = window.chordMagic;

const $in = document.getElementById('in');
const $out = document.getElementById('out');
const $steps = document.getElementById('steps');
const $download = document.getElementById('download');

$in.addEventListener('keyup', () => {
  $out.value = parseAndTranspose($in.value);
});

$download.addEventListener('click', downloadPDF);

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

  const chordPro = stringify(transposedTokens);
  return prettyPrint(chordPro);
}

function downloadPDF() {
  const text = parseAndTranspose($in.value);
  const doc = new jsPDF({
  });

  doc.setFont('courier');
  doc.setFontSize(FONT_SIZE)

  let y = 1;
  let isChordLine = true;
  text.split('\n').forEach((line) => {
    doc.text(line, LINE_PADDING, y, {
      baseline: 'top',
      lineHeightFactor: 0,
    });
    y += isChordLine
      ? FONT_SIZE
      : FONT_SIZE + LINE_PADDING;
    isChordLine = !isChordLine;
  });

  // doc.text(text.split('\n'), LINE_PADDING, LINE_PADDING);

  doc.save('chords.pdf');
}
