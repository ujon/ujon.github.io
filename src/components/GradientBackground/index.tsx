import React from 'react';
import styles from './styles.module.css';

function GradientBackground({children}) {
    return (
        <div className={styles.container}>
            {/* Animated Gradient Background */}
            <div className={styles.bgGradientMoving}>
                <div className={`${styles.gradientOrb} ${styles.gradientOrb1}`}></div>
                <div className={`${styles.gradientOrb} ${styles.gradientOrb2}`}></div>
                <div className={`${styles.gradientOrb} ${styles.gradientOrb3}`}></div>
                <div className={`${styles.gradientOrb} ${styles.gradientOrb4}`}></div>
            </div>
            {children}
        </div>
    );
};

export default GradientBackground;