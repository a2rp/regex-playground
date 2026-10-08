import assert from "node:assert/strict";
import test from "node:test";
import { formatRegexLiteral, getRegexLocation, maxTestLength } from "./regexUtils.js";

test("formats a regular expression with its enabled flags", () => {
    assert.equal(formatRegexLiteral("\\d+", "gi"), "/\\d+/gi");
    assert.equal(formatRegexLiteral("https?://example.com", "g"), "/https?:\\/\\/example.com/g");
});

test("reports one-based locations in multi-line test text", () => {
    assert.deepEqual(getRegexLocation("first\nsecond match", 12), { line: 2, column: 7 });
    assert.deepEqual(getRegexLocation("", 4), { line: 1, column: 1 });
});

test("caps test input to keep worker requests bounded", () => {
    assert.equal(maxTestLength, 10000);
});
