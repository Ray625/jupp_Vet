import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './offer.module.scss'
import Slider from 'react-slick';
import { PrimaryButton, LabelMoreButton } from "../button/button";
import { useNavigate } from 'react-router-dom';

const offers = [
  {
    className: styles.leftCard,
    title: '內科',
    content: '我們備有影像學以及血液學檢查等各項精密儀器，更透過各科醫師之間的快速會診，用專業為毛小孩提供完善優質的醫療服務。',
    onClick: () => {
    alert('you click more btn')
    },
  },
  {
    className: styles.rightCard,
    title: '外科',
    content: '我們的團隊備有麻醉專業的獸醫師，提供可靠與完善的術前準備，並有全天候住院照護，由受過完整培育制度的住院醫師以及住院助理時刻守護。',
    onClick: () => {
    alert('you click more btn')
    },
  }
]

const Card = ({ props }) => {
  const { className, title, content, onClick } = props

  return (
    <div className={className}>
      <h4 className={styles.cardTitle}>{title}</h4>
      <p className={styles.cardContent}>{content}</p>
      <div className={styles.cardBtn}>
        <LabelMoreButton label={'See more'} onClick={onClick}/>
      </div>
    </div>
  )
}

const CardSlider = () => {
  const settings = {
    arrows: false,
    dots: true,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    speed: 500,
    easing: "liner",
    dotsClass:"mobile-slick-dots",
  };

  return (
    <div className={styles.cardSlider}>
      <Slider {...settings}>
        {offers.map((offer) => {
          return <Card props={offer} key={offer.title}/>
        })}
      </Slider>
    </div>
  )
}

const OfferSection = () => {
  const navigate = useNavigate()

  const handleBookingeBtnClick = () => {
    navigate('/booking')
  }

  return (
    <section className={styles.container} id="offer">
      <div className={styles.wrapper}>
        <div className={styles.body}>
          <div className={styles.icon}>
            <img
              src="/svg/home_footprint.svg"
              alt="icon"
              className={styles.footprint}
            />
          </div>
          <h2 className={styles.title}>Our Offer</h2>
          <h3 className={styles.subtitle}>專業醫療服務，用心護理</h3>
          <div className={styles.cardList}>
            {offers.map((offer, index) => {
              return <Card props={offer} key={index} />;
            })}
          </div>
          <CardSlider />
          <PrimaryButton title={"立即預約"} onClick={handleBookingeBtnClick} />
        </div>
      </div>
    </section>
  );
}

export default OfferSection;