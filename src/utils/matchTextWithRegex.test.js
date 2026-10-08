import assert from "node:assert/strict";
import test from "node:test";
import { matchTextWithRegex } from "./matchTextWithRegex.js";

test("returns every global match with capture groups and source positions", () => {
    const result = matchTextWithRegex({ pattern: "(GET) /api/(\\w+)", flags: "g", text: "GET /api/items\nGET /api/users" });
    assert.equal(result.ok, true);
    assert.deepEqual(result.matches.map(({ text }) => text), ["GET /api/items", "GET /api/users"]);
    assert.deepEqual(result.matches[0].groups, ["GET", "items"]);
    assert.deepEqual(result.matches.map(({ index }) => index), [0, 15]);
    assert.equal(result.truncated, false);
});

test("returns named groups and respects the non-global flag", () => {
    const result = matchTextWithRegex({ pattern: "(?<word>cat)", flags: "", text: "cat cat" });
    assert.equal(result.matches.length, 1);
    assert.equal(result.matches[0].namedGroups.word, "cat");
});

test("reports invalid JavaScript patterns without throwing out of the worker", () => {
    const result = matchTextWithRegex({ pattern: "[", flags: "g", text: "test" });
    assert.equal(result.ok, false);
    assert.match(result.error, /regular expression|unterminated|character class/i);
});

test("advances empty Unicode matches without splitting surrogate pairs or looping", () => {
    const result = matchTextWithRegex({ pattern: "(?:)", flags: "gu", text: "a😀b" });
    assert.deepEqual(result.matches.map(({ index }) => index), [0, 1, 3, 4]);
});

test("stops after 500 results and reports a truncated list", () => {
    const result = matchTextWithRegex({ pattern: "a", flags: "g", text: "a".repeat(501) });
    assert.equal(result.matches.length, 500);
    assert.equal(result.truncated, true);
});
