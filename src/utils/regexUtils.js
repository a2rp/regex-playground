export const maxTestLength = 10000;

export const formatRegexLiteral = (pattern, flags) => `/${pattern.replace(/(?<!\\)\//g, "\\/")}/${flags}`;

export const getRegexLocation = (source, index) => {
    const safeIndex = Math.max(0, Math.min(index, source.length));
    const beforeMatch = source.slice(0, safeIndex).split("\n");
    return { line: beforeMatch.length, column: beforeMatch[beforeMatch.length - 1].length + 1 };
};

export const createRegexWorker = () => new Worker(
    new URL("../workers/regexMatcher.worker.js", import.meta.url),
    { type: "module" },
);
