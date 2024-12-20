import styles from './button.module.scss';
import { useNavigate } from 'react-router-dom';

const PrimaryButton = ({ title, onClick }) => {
  return (
    <button className={styles.primaryBtn} onClick={onClick}>
      <span className={styles.primaryBtnText}>{title}</span>
      <span className={styles.primaryBtnBg}></span>
      <img
        src="/svg/footprint_white.svg"
        alt="icon"
        className={styles.footprint}
      />
    </button>
  );
}

const OutlineButton = ({ title, onClick }) => {
  return (
    <button className={styles.outlineBtn} onClick={onClick}>
      {title}
      <img
        src="/svg/footprint_white.svg"
        alt="icon"
        className={styles.footprint}
      />
    </button>
  );
}

const LabelMoreButton = ({ onClick, label }) => {
  return (
    <label className={styles.moreBtnLabel}>
      {label}
      <button className={styles.labelMoreBtn} onClick={onClick}>
          <i className="fa-solid fa-arrow-right"></i>
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