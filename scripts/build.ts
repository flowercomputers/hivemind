import { execSync } from "node:child_process";
import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

// compile typescript
execSync("tsc --project tsconfig.build.json", { stdio: "inherit" });
execSync("resolve-tspaths -p tsconfig.build.json -s ./src -o ./dist", {
  stdio: "inherit",
});

function findFilesByExtension(dir: string, extensions: string[]): string[] {
  const files: string[] = [];

  function walk(currentDir: string) {
    const items = readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (extensions.includes(path.extname(item))) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

// copy txt and json files
const filesToCopy = findFilesByExtension("src", [".txt", ".json", ".sh", ".md"]);
for (const file of filesToCopy) {
  const destFile = file.replace("src/", "dist/");
  mkdirSync(path.dirname(destFile), { recursive: true });
  copyFileSync(file, destFile);
}
