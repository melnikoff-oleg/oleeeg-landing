import { pathToFileURL, fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");

/** `server-only` is a build-time guard; under node it is simply nothing. */
const EMPTY = "data:text/javascript,export {}";

/**
 * The app is written for a bundler, so an import names a module and not a file:
 * `@/lib/...` for the src alias, and `./thing` with no extension. Node resolves
 * neither. Both are handled here rather than by keeping a second, node-shaped
 * copy of the code under test, because a test that runs a copy proves nothing
 * about what ships.
 *
 * The file is looked for on disk rather than by letting `next` fail and
 * catching it: the resolver hook may answer asynchronously, so a try/catch
 * around it catches nothing and the extension hunt silently never happens.
 */
const EXTENSIONS = [".ts", ".tsx", ".mts", "/index.ts", "/index.tsx", ".mjs", ".js"];

/** The first `<file><ext>` that exists, as a URL, or null. */
function onDisk(file) {
  for (const ext of EXTENSIONS) {
    if (existsSync(file + ext)) return pathToFileURL(file + ext).href;
  }
  return null;
}

export function resolve(specifier, context, next) {
  if (specifier === "server-only") return { url: EMPTY, shortCircuit: true };

  if (specifier.startsWith("@/")) {
    const file = path.join(ROOT, "src", specifier.slice(2));
    const found = onDisk(file);
    if (found) return { url: found, shortCircuit: true };
  }

  if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
    const from = path.dirname(fileURLToPath(context.parentURL));
    // Only when the specifier has no extension of its own; `./x.js` is a real
    // request for a real file and must not be redirected to `./x.js.ts`.
    if (!path.extname(specifier)) {
      const found = onDisk(path.resolve(from, specifier));
      if (found) return { url: found, shortCircuit: true };
    }
  }

  return next(specifier, context);
}
