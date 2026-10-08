import { FiAlertCircle, FiCheckCircle, FiLoader, FiTarget } from "react-icons/fi";
import styles from "./styles.module.css";

const getHighlightedText = (text, matches) => {
    const parts = [];
    let cursor = 0;
    matches.forEach((match, index) => {
        if (match.end <= match.index || match.index < cursor) return;
        if (match.index > cursor) parts.push(text.slice(cursor, match.index));
        parts.push(<mark key={`${match.index}-${index}`}>{text.slice(match.index, match.end)}</mark>);
        cursor = match.end;
    });
    if (cursor < text.length) parts.push(text.slice(cursor));
    return parts;
};

const MatchResults = ({ text, result }) => {
    const hasMatches = result.kind === "matches" && result.matches.length > 0;
    const statusText = result.kind === "running"
        ? "Testing pattern..."
        : result.kind === "invalid"
            ? "Invalid expression"
            : result.kind === "timeout"
                ? "Evaluation stopped"
                : result.kind === "matches"
                    ? `${result.matches.length}${result.truncated ? "+" : ""} ${result.matches.length === 1 ? "match" : "matches"}`
                    : "Waiting for input";

    return (
        <section className={styles.panel} aria-labelledby="matches-title">
            <div className={styles.panelHeader}>
                <div className={styles.heading}><span className={styles.icon}><FiTarget aria-hidden="true" /></span><div><h2 id="matches-title">Matches</h2><p>Found in your test text</p></div></div>
                <span className={`${styles.status} ${styles[result.kind]}`} role="status" aria-live="polite">
                    {result.kind === "running" ? <FiLoader aria-hidden="true" /> : result.kind === "invalid" || result.kind === "timeout" ? <FiAlertCircle aria-hidden="true" /> : result.kind === "matches" ? <FiCheckCircle aria-hidden="true" /> : null}
                    {statusText}
                </span>
            </div>
            <div className={styles.resultsBody}>
                {text && <div className={styles.highlightBox} aria-label="Test text with matches highlighted"><pre>{getHighlightedText(text, result.kind === "matches" ? result.matches : [])}</pre></div>}
                {hasMatches ? (
                    <ol className={styles.matchList}>
                        {result.matches.map((match, index) => (
                            <li className={styles.matchCard} key={`${match.index}-${index}`}>
                                <div className={styles.matchCardTop}><span className={styles.matchIndex}>Match {index + 1}</span><span className={styles.location}>Line {match.line}, column {match.column}</span></div>
                                <code className={styles.matchText}>{match.text || "(empty match)"}</code>
                                {(match.namedGroups || match.groups.length > 0) && (
                                    <div className={styles.groups}>
                                        <p>Capture groups</p>
                                        {match.namedGroups
                                            ? Object.entries(match.namedGroups).map(([name, value]) => <span key={name}><b>{name}</b> {value ?? "(no value)"}</span>)
                                            : match.groups.map((value, groupIndex) => <span key={groupIndex}><b>${groupIndex + 1}</b> {value ?? "(no value)"}</span>)}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ol>
                ) : (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>{result.kind === "invalid" || result.kind === "timeout" ? "!" : "∅"}</span>
                        <strong>{result.kind === "invalid" ? "Check your expression" : result.kind === "timeout" ? "Pattern took too long" : result.kind === "running" ? "Checking for matches" : "No matches yet"}</strong>
                        <p>{result.kind === "invalid" ? result.error : result.kind === "timeout" ? "The worker stopped after 500 ms so the page remains responsive. Try a simpler pattern or shorter text." : result.kind === "running" ? "The test is running away from the main page thread." : "Change the pattern or add text to see matching results."}</p>
                    </div>
                )}
                {result.truncated && <p className={styles.truncated}>Showing the first 500 matches. Narrow the expression or test text for more detail.</p>}
            </div>
            <div className={styles.panelFooter}><span>Match positions start at 1</span><span>Worker isolated</span></div>
        </section>
    );
};

export default MatchResults;
