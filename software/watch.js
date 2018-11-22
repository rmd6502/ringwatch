const cathodes = [D20,D28,D17,D15];
const anodes = [D26,D27,D18,D30,D19,D29,D31,D16].reverse();
const patterns = {
    '0': 63,  '1': 6,  '2': 91, '3': 79,
    '4': 102, '5': 109,'6': 125,'7': 7,
    '8': 127, '9': 111,'a': 95, 'b': 124,
    'c': 88,  'd': 94, 'e': 121,'f': 113,
    'u': 62,  '-': 64
};

var count = 0;
var decimal = 0;
var k = 3;
var pattern = "   0";
var currentMode = 0;
var updateInterval = null;
var blankInterval = null;

function getClockDate() {
  const d = new Date();
  count = (d.getMonth() + 1) * 100 + d.getDate();
  pattern = ("   " + count.toString(10)).slice(-4);
  const s = d.getSeconds();
  decimal = 0x80 * (s & 1);
}

function getClockTime() {
  const d = new Date();
  count = d.getHours() * 100 + d.getMinutes();
  pattern = ("    " + count.toString(10)).slice(-4);
  const s = d.getSeconds();
  decimal = 0x80 * (s & 1);
}

function getClockSeconds() {
  const d = new Date();
  count = d.getSeconds();
  pattern = "  " + ("00" + count.toString(10)).slice(-2);
  decimal = 0x80 * (count & 1);
}

const modes = [getClockTime, getClockDate, getClockSeconds];

function incMode() {
  if (updateInterval !== null) {
    clearTimeout(blankInterval);
    currentMode = (currentMode + 1) % modes.length;
  } else {
    currentMode = 0;
    updateInterval = setInterval(() => modes[currentMode](), 500);
    setTimeout(update, 0);
  }
  modes[currentMode]();
  blankInterval = setTimeout(doBlank, 10000);
}

function onInit() {
  setTimeout(update, 0);
  getClockTime();
  updateInterval = setInterval(() => modes[currentMode](), 500);
  setWatch(incMode, D0, {
    repeat: true, edge: 'rising', debounce: 2
  });
  blankInterval = setTimeout(doBlank, 10000);
}

function doBlank() {
  ui = updateInterval;
  updateInterval = null;
  clearInterval(ui);
}

function update() {
  digitalWrite(anodes, 0);
  digitalWrite(cathodes[k++], 1);
  if (k >= cathodes.length) {
    k = 0;
  }
  var ch = pattern[k].toLowerCase();
  var pattern_value = patterns[ch];
  if (pattern_value !== undefined) {
    digitalWrite(cathodes[k], 0);
    digitalWrite(anodes, pattern_value);
  }
  if (updateInterval !== null) {
    setTimeout(update, 1);
  } else {
    digitalWrite(anodes, 0);
  }
}
