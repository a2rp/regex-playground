import { useEffect, useRef } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const ResetConfirm = ({ onCancel, onConfirm }) => {
    const cancelRef = useRef(null);
    useEffect(() => {
        cancelRef.current?.focus();
        const handleKeyDown = (event) => { if (event.key === "Escape") onCancel(); };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onCancel]);

    return (
        <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
            <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="reset-title" aria-describedby="reset-description">
                <button className={styles.closeButton} type="button" aria-label="Close dialog" onClick={onCancel}><FiX aria-hidden="true" /></button>
                <span className={styles.icon}><FiAlertTriangle aria-hidden="true" /></span>
                <h2 id="reset-title">Replace the current test?</h2>
                <p id="reset-description">Your expression and test text will be replaced by the sample. This will not change anything if you cancel.</p>
                <div className={styles.actions}><button ref={cancelRef} className={styles.cancelButton} type="button" onClick={onCancel}>Keep editing</button><button className={styles.confirmButton} type="button" onClick={onConfirm}>Load sample</button></div>
            </section>
        </div>
    );
};

export default ResetConfirm;
