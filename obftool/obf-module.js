#!/usr/bin/env node
/**
 * obf-module.js — obfuscate a single ES-module <script type="module"> block,
 * preserving top-level `await` and dynamic `import()` (no IIFE wrapper).
 * Also injects a lightweight anti-copy protection layer before </body>.
 *
 * Usage: node obf-module.js <input.html> <output.html>
 */
const fs = require('fs');
const Obfuscator = require('javascript-obfuscator');

const [, , inFile, outFile] = process.argv;
if (!inFile || !outFile) { console.error('usage: node obf-module.js in.html out.html'); process.exit(1); }

let html = fs.readFileSync(inFile, 'utf8');

const OPTS = {
  compact: true,
  simplify: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.6,
  deadCodeInjection: false,
  stringArray: true,
  stringArrayThreshold: 1,
  stringArrayEncoding: ['base64'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersType: 'variable',
  splitStrings: true,
  splitStringsChunkLength: 8,
  transformObjectKeys: true,
  numbersToExpressions: true,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  renameProperties: false,
  selfDefending: false,
  debugProtection: false,
  disableConsoleOutput: true,
  sourceMap: false,
  sourceType: 'module',
  seed: 0,
};

let obf = 0;
html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (full, attrs, body) => {
  const isModule = /type\s*=\s*["']module["']/i.test(attrs);
  const isImportmap = /type\s*=\s*["']importmap["']/i.test(attrs);
  const isData = /type\s*=\s*["']application\/(ld\+json|json)["']/i.test(attrs);
  const hasSrc = /\bsrc\s*=/i.test(attrs);
  if (isImportmap || isData || hasSrc || !body.trim()) return full;
  try {
    // clone opts; only module scripts use sourceType:'module' + preserve top-level await
    const opts = Object.assign({}, OPTS, isModule ? {} : { sourceType: 'script' });
    const out = Obfuscator.obfuscate(body, opts).getObfuscatedCode();
    obf++;
    console.log(`  [obf${isModule ? '-module' : ''}] ${body.length} -> ${out.length} bytes`);
    return `<script${attrs}>${out}</script>`;
  } catch (e) {
    console.error('  [SKIP] ' + e.message);
    return full;
  }
});

const PROTECT = `
<script>
(function(){
  var b=function(e){e&&e.preventDefault&&e.preventDefault();e&&(e.returnValue=false);return false};
  document.addEventListener('contextmenu',b);
  document.addEventListener('keydown',function(e){
    var k=(e.key||'').toLowerCase();
    if(k==='f12')return b(e);
    if(e.ctrlKey&&e.shiftKey&&['i','j','c','k'].indexOf(k)>-1)return b(e);
    if(e.ctrlKey&&['u','s'].indexOf(k)>-1)return b(e);
    if(e.metaKey&&e.altKey&&['i','j','c','u'].indexOf(k)>-1)return b(e);
  },true);
  try{if(window.top!==window.self)window.top.location=window.self.location}catch(e){}
})();
</script>
`;
if (/<\/body>/i.test(html)) html = html.replace(/<\/body>/i, PROTECT + '</body>');
else html += PROTECT;

fs.writeFileSync(outFile, html);
console.log(`Done. ${obf} module block(s) obfuscated. Output: ${outFile}`);
