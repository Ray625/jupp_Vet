import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './ticker.module.scss';
import Slider from "react-slick";

const news = [
    '2025 春節營業時間調整: 1/28至2/1休診，請需要拿藥的毛孩提前準備。',
    '2025 2/26至2/28休診: 醫師外出進修，暫停看診兩日。',
    '2025 4/1休診: 院內進行設備更新，暫停看診。',
  ]

const NewsSlider = () => {
  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    vertical: true, // 垂直切換
    speed: 1500,
    autoplaySpeed: 5000,
    easing: "ease",
  };

  return (
    <div className={styles.cardSlider}>
      <Slider {...settings}>
        {news.map((newsItem, index) => {
          return <p className={styles.news} key={index}>{newsItem}</p>
        })}
      </Slider>
    </div>
  )
}

const Ticker = ({ onClick }) => {

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <NewsSlider />
      </div>
        <button className={styles.closeBtn} aria-label="close" onClick={onClick}><i className="fa-solid fa-xmark"></i></button>
    </div>
  )
}

export default Ticker;