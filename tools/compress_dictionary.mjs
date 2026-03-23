import { brotliCompressSync, constants, gzipSync } from 'node:zlib';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const inputPath = resolve(root, 'public/data/dictionary.json');
const gzipPath = resolve(root, 'public/data/dictionary.json.gz');
const brPath = resolve(root, 'public/data/dictionary.json.br');

const source = readFileSync(inputPath);
const gzip = gzipSync(source, { level: 9 });
const br = brotliCompressSync(source, {
  params: {
    [constants.BROTLI_PARAM_QUALITY]: 11,
  },
});

writeFileSync(gzipPath, gzip);
writeFileSync(brPath, br);

console.log(`Wrote ${gzipPath}`);
console.log(`Wrote ${brPath}`);
