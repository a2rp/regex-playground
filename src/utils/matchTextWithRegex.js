export const matchTextWithRegex = ({ pattern, flags, text }) => {
    try {
        const expression = new RegExp(pattern, flags);
        const matches = [];
        let match = expression.exec(text);
        while (match && matches.length < 500) {
            matches.push({
                text: match[0],
                index: match.index,
                end: match.index + match[0].length,
                groups: match.slice(1),
                namedGroups: match.groups || null,
            });
            if (!expression.global) break;
            if (match[0].length === 0) {
                const currentIndex = expression.lastIndex;
                const isSurrogatePair = expression.unicode && currentIndex + 1 < text.length
                    && text.charCodeAt(currentIndex) >= 0xD800
                    && text.charCodeAt(currentIndex) <= 0xDBFF
                    && text.charCodeAt(currentIndex + 1) >= 0xDC00
                    && text.charCodeAt(currentIndex + 1) <= 0xDFFF;
                expression.lastIndex += isSurrogatePair ? 2 : 1;
            }
            match = expression.exec(text);
        }
        return { ok: true, matches, truncated: matches.length === 500 && expression.global && Boolean(match) };
    } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
};
