import { FiGithub, FiTarget } from "react-icons/fi";
import styles from "./styles.module.css";

const SiteHeader = () => (
    <header className={styles.header}>
        <a className={styles.brand} href="#top" aria-label="Regex Playground home"><span className={styles.brandMark}><FiTarget aria-hidden="true" /></span><span>pattern<span className={styles.brandAccent}>lab</span></span></a>
        <nav className={styles.navigation} aria-label="Main navigation"><a href="#playground">Playground</a><a href="#guide">Quick guide</a></nav>
        <a className={styles.repository} href="https://github.com/a2rp/regex-playground" target="_blank" rel="noreferrer"><FiGithub aria-hidden="true" /><span>Repository</span></a>
    </header>
);

export default SiteHeader;
