import styles from './booking.module.scss';
import { useNavigate } from 'react-router-dom';
import { forwardRef } from 'react';
import { PrimaryButton } from '../button/button';

const BookSection = forwardRef((props, ref) => {
  const navigate = useNavigate()

  const handleBookBtnClick = () => {
    navigate('/booking')
  }

  return (
    <section className={styles.container} ref={ref}>
      <div className={styles.wrapper}>
        <object data="/svg/home_footprint_white.svg" className={styles.footprint} aria-label="footprint"> </object>
        <h2 className={styles.title}>Booking Now</h2>
        <h3 className={styles.subtitle}>讓我們為您的寵物提供專業醫療服務</h3>
        <PrimaryButton title={'立即預約'} onClick={handleBookBtnClick}/>
      </div>
    </section>
  )
})

BookSection.displayName = "BookSection";

export default BookSection;