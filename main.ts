import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Sleep v3.1: REM cycles now allocate correctly; resolved an issue where 4 hours of sleep returned 40 years of night.";

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

// Guards: exactly one line, 1-160 UTF-8 chars, not only whitespace.
if (LINE.length < 1 || LINE.length > 160) {
  fail(`entry must be 1-160 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  fail("entry must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("entry must be exactly one line");
}
// Real guard improvement: no control characters, no leading/trailing
// whitespace (a padded line reads as sloppy release notes, not terse ones).
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  fail("entry must not contain control characters");
}
if (LINE !== LINE.trim()) {
  fail("entry must not have leading or trailing whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE + "\n", "utf8");
// Read-back check: what landed on disk must be exactly the line + newline.
const back = readFileSync(outPath, "utf8");
if (back !== LINE + "\n") {
  fail("read-back mismatch: file on disk differs from the entry line");
}
console.log(`wrote ${outPath} (${LINE.length} chars)`);
