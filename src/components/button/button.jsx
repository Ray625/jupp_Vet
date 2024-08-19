import styles from './button.module.scss';
import { useNavigate } from 'react-router-dom';

const PrimaryButton = ({ title, onClick }) => {
  return (
    <button className={styles.primaryBtn} onClick={onClick}>
      {title}
      <object data="/svg/footprint_white.svg" className={styles.footprint} aria-label="footprint"> </object>
    </button>
  )
}

const OutlineButton = ({ title, onClick }) => {
  return (
    <button className={styles.outlineBtn} onClick={onClick}>
      {title}
      <object data="/svg/footprint_white.svg" className={styles.footprint} aria-label="footprint"> </object>
    </button>
  )
}

const LabelMoreButton = ({ onClick, label }) => {
  return (
    <label className={styles.moreBtnLabel}>
      {label}
      <button className={styles.labelMoreBtn} onClick={onClick}>
          <i class="fa-solid fa-arrow-right"></i>
      </button>
    </label>
  )
}

const BookingButton = () => {
  const navigate = useNavigate()

  const handleBookingBtnClick = () => {
    navigate('/login')
  }

  return (
    <div className={styles.mobileBookBtn} onClick={handleBookingBtnClick}>
      立即<br/>預約
    </div>
  )
}



export { PrimaryButton, OutlineButton, LabelMoreButton, BookingButton };