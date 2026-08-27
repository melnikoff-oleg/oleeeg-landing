import { pathToFileURL } from "node:url";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");

/** `server-only` is a build-time guard; under node it is simply nothing. */
const EMPTY = "data:text/javascript,export {}";

export function resolve(specifier, context, next) {
  if (specifier === "server-only") return { url: EMPTY, shortCircuit: true };
  if (specifier.startsWith("@/")) {
    const file = path.join(ROOT, "src", specifier.slice(2));
    // The alias is written without an extension, the way the bundler takes it.
    for (const ext of [".ts", ".tsx", "/index.ts", ".mjs", ".js"]) {
      const candidate = `${file}${ext}`;
      try {
        return next(pathToFileURL(candidate).href, context);
      } catch {
        // Try the next extension.
      }
    }
    return next(pathToFileURL(file).href, context);
  }
  return next(specifier, context);
}
