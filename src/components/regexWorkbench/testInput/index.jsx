import { FiFileText } from "react-icons/fi";
import { maxTestLength } from "../../../utils/regexUtils.js";
import styles from "./styles.module.css";

const TestInput = ({ value, onChange }) => (
    <section className={styles.panel} aria-labelledby="test-input-title">
        <div className={styles.panelHeader}><div className={styles.heading}><span className={styles.icon}><FiFileText aria-hidden="true" /></span><div><h2 id="test-input-title">Test text</h2><p>Matches update as you edit</p></div></div><span className={styles.count}>{value.length.toLocaleString()} / {maxTestLength.toLocaleString()}</span></div>
        <label className={styles.visuallyHidden} htmlFor="regex-test-text">Text to test against the expression</label>
        <textarea id="regex-test-text" value={value} onChange={(event) => onChange(event.target.value)} maxLength={maxTestLength} spellCheck="false" placeholder="Paste a string or a few lines of text..." />
        <div className={styles.panelFooter}><span>Line breaks are preserved</span><span>Max 10,000 characters</span></div>
    </section>
);

export default TestInput;
