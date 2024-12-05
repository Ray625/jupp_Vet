import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './sliderBanner.module.scss';
import Slider from "react-slick";
import { OutlineButton } from "../button/button";
import useTheme from '../../hooks/useTheme';

const SliderBanner = () => {
  const { tickerOpen } = useTheme();

  const handleMoreBtnClick = () => {
    alert("You click more button!");
  };

  const PrevArrowButton = ({ onClick }) => {
    return (
      <button className={styles.prevArrowBtn} onClick={onClick}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>
    );
  };

  const NextArrowButton = ({ onClick }) => {
    return (
      <button className={styles.nextArrowBtn} onClick={onClick}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 3000,
    easing: "ease",
    nextArrow: <NextArrowButton />,
    prevArrow: <PrevArrowButton />,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          autoplay: true,
          speed: 1000,
          autoplaySpeed: 3000,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section
      className={styles.container}
      style={{ paddingTop: tickerOpen ? "124px" : "80px" }}
      id="home"
    >
      <Slider {...settings}>
        <div className={styles.wrapper}>
          <div className={styles.bannerBody}>
            <div className={styles.titleGroup}>
              <p className={styles.title}>像家人一樣呵護您的寵物</p>
              <p className={styles.enTitle}>
                Caring for your pets like <span>family</span>
                <img
                  src="/svg/home_footprint.svg"
                  alt="icon"
                  className={styles.footprint}
                />
              </p>
            </div>
            <OutlineButton title={"瞭解更多"} onClick={handleMoreBtnClick} />
          </div>
        </div>
        <div className={styles.wrapper_2}>
          <div className={styles.bannerBody}>
            <div className={styles.titleGroup}>
              <p className={styles.title}>寵物的健康是我們的首要任務</p>
              <p className={styles.enTitle}>
                {`Your pet's health is our priority`}
                <img
                  src="/svg/home_footprint_white.svg"
                  alt="icon"
                  className={styles.footprint}
                />
              </p>
            </div>
            <OutlineButton title={"瞭解更多"} onClick={handleMoreBtnClick} />
          </div>
        </div>
      </Slider>
    </section>
  );
};

export default SliderBanner;