import styles from './reason.module.scss';
import { useEffect, useState, useRef } from 'react';
import useDevice from '../../hooks/useDevice';
import { deviceParams } from '../../utils/const';

const ReasonSection = () => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isVisible, setIsVisible] = useState(false);
  const backgroundRef = useRef(null)
  const device = useDevice()

  useEffect(() => {
    // 確定元件進入可視範圍內，再開始套用滾動視差的效果
    const checkVisibility = () => {
      if (backgroundRef.current) {
        const rect = backgroundRef.current.getBoundingClientRect();
        setIsVisible(rect.top < window.innerHeight && rect.bottom >= 0);
        if (rect.top < window.innerHeight) {
          setScrollPosition(window.innerHeight - rect.top);
        }
      }
    };

    window.addEventListener('scroll', checkVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, []);

  return (
    <section className={styles.container}>
      <div
        ref={backgroundRef}
        className={styles.background}
        style={{
          transform: isVisible
            ? `translateY(${scrollPosition * 0.45}px)`
            : "none",
        }}
      ></div>
      <div className={styles.wrapper}>
        <div className={styles.titleContainer}>
          <div className={styles.titleGroup}>
            <object
              data="/svg/home_footprint_white.svg"
              className={styles.footprint}
              aria-label="footprint"
            >
              {" "}
            </object>
            <h2 className={styles.title}>Why Choose Us</h2>
          </div>
          <h3 className={styles.subtitle}>我們值得您的信賴與安心</h3>
        </div>
        <div className={styles.body}>
          <div className={styles.content}>
            <h4 className={styles.num}>15</h4>
            {(device === deviceParams.tablet ||
              device === deviceParams.laptop) && (
                <p className={styles.describe}>位專業醫師</p>
              )}
            {(device === deviceParams.mobile ||
              device === deviceParams.pc) && (
                <p className={styles.describe}>15位專業醫師</p>
              )}
          </div>
          <div className={styles.content}>
            <h4 className={styles.num}>20</h4>
            {(device === deviceParams.tablet ||
              device === deviceParams.laptop) && (
                <p className={styles.describe}>年看診經驗</p>
              )}
            {(device === deviceParams.mobile ||
              device === deviceParams.pc) && (
              <p className={styles.describe}>20年看診經驗</p>
            )}
          </div>
          <div className={styles.content}>
            <h4 className={styles.num}>1,000+</h4>
            {(device === deviceParams.tablet ||
              device === deviceParams.laptop) && (
                <p className={styles.describe}>則滿意好評回饋</p>
              )}
            {(device === deviceParams.mobile ||
              device === deviceParams.pc) && (
              <p className={styles.describe}>千則滿意好評回饋</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReasonSection;