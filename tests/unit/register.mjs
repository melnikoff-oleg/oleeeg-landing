// Lets `node --test` run the app's own modules.
//
// Two things stand between node and src/: the `@/...` path alias, which is a
// bundler convention node knows nothing about, and `server-only`, which is a
// package whose whole job is to throw when it is imported outside a server
// bundle. Both are resolved here rather than by keeping a second, node-shaped
// copy of the code under test, because a test that runs a copy proves nothing
// about what ships.
import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./resolve.mjs", pathToFileURL(import.meta.filename));
