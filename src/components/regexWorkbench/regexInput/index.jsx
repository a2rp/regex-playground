import { FiHash } from "react-icons/fi";
import styles from "./styles.module.css";

const flagOptions = [
    { id: "g", label: "Global", description: "Find every match" },
    { id: "i", label: "Ignore case", description: "Match upper or lower case" },
    { id: "m", label: "Multiline", description: "Make anchors match lines" },
    { id: "s", label: "Dot all", description: "Let dot match line breaks" },
    { id: "u", label: "Unicode", description: "Use Unicode-aware matching" },
];

const RegexInput = ({ pattern, onChange, patternRef, flags, onToggleFlag }) => {
    const flagString = flagOptions.filter(({ id }) => flags[id]).map(({ id }) => id).join("");

    return (
        <section className={styles.panel} aria-labelledby="pattern-title">
            <div className={styles.panelHeader}><div><p className={styles.panelLabel}><FiHash aria-hidden="true" /> Pattern</p><h2 id="pattern-title">Write an expression</h2></div><span className={styles.engineBadge}>JavaScript RegExp</span></div>
            <label className={styles.regexField} htmlFor="regex-pattern">
                <span aria-hidden="true">/</span>
                <input ref={patternRef} id="regex-pattern" value={pattern} onChange={(event) => onChange(event.target.value)} spellCheck="false" autoComplete="off" autoCapitalize="off" placeholder="Try \\bword\\b" />
                <span aria-hidden="true">/</span><code className={styles.liveLiteral}>{flagString || "no flags"}</code>
            </label>
            <div className={styles.flags} role="group" aria-label="Regular expression flags">
                {flagOptions.map(({ id, label, description }) => (
                    <label className={styles.flag} key={id} title={description}>
                        <input type="checkbox" checked={flags[id]} onChange={() => onToggleFlag(id)} />
                        <span>{id}</span><small>{label}</small>
                    </label>
                ))}
            </div>
            <p className={styles.helper}>This tool uses the browser's JavaScript regular expression engine.</p>
        </section>
    );
};

export default RegexInput;
