import { readFileSync } from "node:fs";

const ENV_FILE = ".env";
const ENV_LINE = /^\s*([A-Z0-9_]+)=(.*)$/;
const ENV_REFERENCE = /\$\{([A-Z0-9_]+)\}/g;

export function loadEnv(path = ENV_FILE) {
  let contents;

  try {
    contents = readFileSync(path, "utf8");
  } catch {
    return;
  }

  const values = {};

  for (const line of contents.split("\n")) {
    const match = ENV_LINE.exec(line);
    if (!match) continue;

    values[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }

  for (const [key, rawValue] of Object.entries(values)) {
    process.env[key] ??= rawValue.replace(
      ENV_REFERENCE,
      (_reference, name) => values[name] ?? process.env[name] ?? "",
    );
  }
}
