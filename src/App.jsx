import { FiArrowRight, FiCheck, FiCode, FiShield } from "react-icons/fi";
import RegexWorkbench from "./components/regexWorkbench/index.jsx";
import SiteHeader from "./components/siteHeader/index.jsx";
import SiteFooter from "./components/siteFooter/index.jsx";
import BackToTop from "./components/backToTop/index.jsx";
import styles from "./App.module.css";

const App = () => (
    <div className={styles.appShell} id="top">
        <SiteHeader />
        <main>
            <section className={styles.hero} aria-labelledby="hero-title">
                <div className={styles.heroInner}>
                    <div className={styles.heroCopy}>
                        <p className={styles.heroLabel}><FiCode aria-hidden="true" /> Regular expression workbench</p>
                        <h1 id="hero-title">Find the shape<br /><span>inside your text.</span></h1>
                        <p className={styles.heroDescription}>Build a JavaScript pattern, test it against real text, and see each match and capture group in place.</p>
                        <a className={styles.heroButton} href="#playground">Open the playground <FiArrowRight aria-hidden="true" /></a>
                        <p className={styles.safeNote}><FiShield aria-hidden="true" /> Matching runs in a disposable worker.</p>
                    </div>
                    <div className={styles.heroVisual} aria-label="Example regular expression and match result" role="img">
                        <div className={styles.visualHeader}><span className={styles.visualDots}><i /><i /><i /></span><span>match trace</span><FiCheck aria-hidden="true" /></div>
                        <div className={styles.visualCode}><span>REGEX</span><code>^GET\s+\/api\/\w+</code></div>
                        <div className={styles.visualResult}><span>TEST STRING</span><p>2026-05-12 <b>GET /api/products</b> status=200</p><div><i /> <strong>GET /api/products</strong><small>line 1, column 12</small></div></div>
                        <div className={styles.visualFoot}><span>01 match</span><span>global + multiline</span></div>
                    </div>
                </div>
                <div className={styles.heroBottom}><span>Pattern on one side. Proof on the other.</span><span>JAVASCRIPT <i /> LIVE TEST <i /> SAFE TIMEOUT</span></div>
            </section>
            <RegexWorkbench />
            <section className={styles.guide} id="guide" aria-labelledby="guide-title">
                <div className={styles.guideHeading}><p>Quick guide</p><h2>Use the controls with confidence.</h2></div>
                <div className={styles.guideGrid}>
                    <article><span>01</span><div><h3>Flags tune the search</h3><p>Global finds every non-overlapping match. Ignore case, multiline, dot all, and Unicode use the browser's JavaScript RegExp rules.</p></div></article>
                    <article><span>02</span><div><h3>Groups capture parts</h3><p>Parentheses capture text for the result list. Named groups appear with their names, and every match includes a one-based line and column.</p></div></article>
                    <article><span>03</span><div><h3>The test stays bounded</h3><p>The sample area accepts up to 10,000 characters. Matching runs off the main thread and stops if it exceeds 500 ms.</p></div></article>
                </div>
            </section>
        </main>
        <SiteFooter />
        <BackToTop />
    </div>
);

export default App;
