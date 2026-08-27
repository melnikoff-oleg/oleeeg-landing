import { test } from "node:test";
import assert from "node:assert/strict";
import { decodeEmbedding } from "@/lib/search/embed";

/** The bytes OpenAI sends back for a vector, when asked for base64. */
function encode(values: number[]): string {
  const buf = Buffer.alloc(values.length * 4);
  values.forEach((v, i) => buf.writeFloatLE(v, i * 4));
  return buf.toString("base64");
}

test("a base64 vector decodes to the numbers that went in", () => {
  const values = [0.125, -0.5, 0, 1, -0.03125];
  const out = decodeEmbedding(encode(values), values.length);
  assert.equal(out?.length, values.length);
  // Exactly, not approximately: these all have exact float32 representations,
  // so any drift would be a decoding fault rather than precision.
  values.forEach((v, i) => assert.equal(out![i], v));
});

test("a plain array of numbers is passed through untouched", () => {
  // OpenAI still answers with JSON floats if the request did not ask for
  // base64, and the vectors already sitting in the Postgres cache were written
  // from that path.
  assert.deepEqual(decodeEmbedding([1, 2, 3], 3), [1, 2, 3]);
});

test("a vector of the wrong width is refused, not truncated", () => {
  // A width mismatch means the model or the request changed. Half a vector
  // ranks the whole library wrongly and nothing about it looks broken.
  assert.equal(decodeEmbedding(encode([1, 2, 3]), 4), null);
  assert.equal(decodeEmbedding([1, 2, 3], 4), null);
});

test("anything that is not a vector is refused", () => {
  assert.equal(decodeEmbedding(undefined, 3), null);
  assert.equal(decodeEmbedding(null, 3), null);
  assert.equal(decodeEmbedding({}, 3), null);
  assert.equal(decodeEmbedding("not base64 at all !!!", 3), null);
});

test("a base64 string whose length is not a multiple of four floats is refused", () => {
  assert.equal(decodeEmbedding(Buffer.from([1, 2, 3]).toString("base64"), 1), null);
});
