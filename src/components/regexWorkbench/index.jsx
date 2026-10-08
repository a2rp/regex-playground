import { useEffect, useRef, useState } from "react";
import { FiAlertTriangle, FiCopy, FiPlus, FiRefreshCw, FiShield } from "react-icons/fi";
import { createRegexWorker, formatRegexLiteral, getRegexLocation } from "../../utils/regexUtils.js";
import { maxTestLength } from "../../utils/regexUtils.js";
import MatchResults from "./matchResults/index.jsx";
import RegexInput from "./regexInput/index.jsx";
import ResetConfirm from "./resetConfirm/index.jsx";
import TestInput from "./testInput/index.jsx";
import styles from "./styles.module.css";

const examplePattern = String.raw`\b(?:GET|POST|DELETE)\s+\/api\/[\w/-]+`;
const exampleText = `2026-05-12 INFO GET /api/products/42 status=200
2026-05-12 WARN POST /api/orders status=201
2026-05-12 ERROR GET /api/session status=401

Tip: try adding a capture group around the endpoint name.`;
const patternTokens = [
    { token: "\\d", label: "digit" },
    { token: "\\w", label: "word" },
    { token: "\\s", label: "space" },
    { token: ".*", label: "anything" },
    { token: "^", label: "start" },
    { token: "$", label: "end" },
];

const RegexWorkbench = () => {
    const [pattern, setPattern] = useState(examplePattern);
    const [testText, setTestText] = useState(exampleText);
    const [flags, setFlags] = useState({ g: true, i: false, m: true, s: false, u: false });
    const [result, setResult] = useState({ kind: "running", matches: [], error: "", truncated: false });
    const [copyState, setCopyState] = useState("idle");
    const [resetOpen, setResetOpen] = useState(false);
    const patternRef = useRef(null);
    const flagString = ["g", "i", "m", "s", "u"].filter((flag) => flags[flag]).join("");

    useEffect(() => {
        let debounceId;
        let timeoutId;
        let worker;
        let active = true;

        debounceId = window.setTimeout(() => {
            setResult({ kind: "running", matches: [], error: "", truncated: false });
            try {
                worker = createRegexWorker();
                const cleanupWorker = () => {
                    if (timeoutId) window.clearTimeout(timeoutId);
                    worker?.terminate();
                    worker = null;
                };

                worker.onmessage = (event) => {
                    if (!active) return;
                    cleanupWorker();
                    if (!event.data.ok) {
                        setResult({ kind: "invalid", matches: [], error: event.data.error, truncated: false });
                        return;
                    }
                    const matches = event.data.matches.map((match) => ({ ...match, ...getRegexLocation(testText, match.index) }));
                    setResult({ kind: "matches", matches, error: "", truncated: event.data.truncated });
                };
                worker.onerror = (event) => {
                    if (!active) return;
                    cleanupWorker();
                    setResult({ kind: "invalid", matches: [], error: event.message || "The regular expression could not be evaluated.", truncated: false });
                };
                timeoutId = window.setTimeout(() => {
                    if (!active) return;
                    cleanupWorker();
                    setResult({ kind: "timeout", matches: [], error: "", truncated: false });
                }, 500);
                worker.postMessage({ pattern, flags: flagString, text: testText });
            } catch (error) {
                setResult({ kind: "invalid", matches: [], error: error.message, truncated: false });
            }
        }, 140);

        return () => {
            active = false;
            window.clearTimeout(debounceId);
            if (timeoutId) window.clearTimeout(timeoutId);
            worker?.terminate();
        };
    }, [pattern, flagString, testText]);

    const toggleFlag = (flag) => setFlags((currentFlags) => ({ ...currentFlags, [flag]: !currentFlags[flag] }));

    const insertToken = (token) => {
        const input = patternRef.current;
        if (!input) return;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        setPattern(`${pattern.slice(0, start)}${token}${pattern.slice(end)}`);
        window.requestAnimationFrame(() => {
            input.focus();
            input.setSelectionRange(start + token.length, start + token.length);
        });
    };

    const copyPattern = async () => {
        try {
            await navigator.clipboard.writeText(formatRegexLiteral(pattern, flagString));
            setCopyState("copied");
            window.setTimeout(() => setCopyState("idle"), 1500);
        } catch {
            setCopyState("failed");
            window.setTimeout(() => setCopyState("idle"), 2000);
        }
    };

    const cancelReset = () => setResetOpen(false);
    const loadExample = () => {
        setPattern(examplePattern);
        setTestText(exampleText);
        setFlags({ g: true, i: false, m: true, s: false, u: false });
        setCopyState("idle");
        setResetOpen(false);
    };

    return (
        <section className={styles.workbench} id="playground" aria-labelledby="workbench-title">
            <div className={styles.workbenchHeading}>
                <div><p className={styles.sectionLabel}><FiShield aria-hidden="true" /> Isolated matcher</p><h2 id="workbench-title">Build, test, refine.</h2></div>
                <div className={styles.headingActions}>
                    <span className={styles.workerBadge}><i /> 500 ms worker limit</span>
                    <button className={styles.copyButton} type="button" onClick={copyPattern} title="Copy expression and flags"><FiCopy aria-hidden="true" /> {copyState === "copied" ? "Copied" : copyState === "failed" ? "Unavailable" : "Copy regex"}</button>
                    <button className={styles.exampleButton} type="button" onClick={() => setResetOpen(true)}><FiRefreshCw aria-hidden="true" /> Load sample</button>
                </div>
            </div>

            <RegexInput pattern={pattern} onChange={setPattern} patternRef={patternRef} flags={flags} onToggleFlag={toggleFlag} />
            <div className={styles.tokenBar} role="group" aria-label="Insert a common regular expression token">
                <span>Insert</span>
                {patternTokens.map(({ token, label }) => <button type="button" key={token} title={`Insert ${label}`} onClick={() => insertToken(token)}><code>{token}</code><small>{label}</small><FiPlus aria-hidden="true" /></button>)}
            </div>
            <div className={styles.resultGrid}>
                <TestInput value={testText} onChange={setTestText} />
                <MatchResults text={testText} result={result} />
            </div>
            <div className={styles.footerNote}><FiAlertTriangle aria-hidden="true" /><p>JavaScript regex patterns can take a long time on certain inputs. Matching runs in a disposable worker that is stopped after 500 ms, so the editor remains responsive.</p><span>{testText.length.toLocaleString()} / {maxTestLength.toLocaleString()}</span></div>
            {resetOpen && <ResetConfirm onCancel={cancelReset} onConfirm={loadExample} />}
        </section>
    );
};

export default RegexWorkbench;
