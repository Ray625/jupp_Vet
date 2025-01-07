import { PrimaryButton } from "../button/button";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import styles from './news.module.scss';
import useDevice from "../../hooks/useDevice";
import { deviceParams } from "../../utils/const";

const news = [{
    id:1,
    img: '/img/news_photo_1.png',
    tagName: '診所公告',
    newsDate: '2025.01.31',
    newsTitle: '2025 春節營業時間調整公告，請需要備藥的寶貝家長先行準備。',
    onCardClick: () => {
      alert('You click card')
    }
  },
  {
    id:2,
    img: '/img/news_photo_2.png',
    tagName: '優惠訊息',
    newsDate: '2025.01.15',
    newsTitle: '2025 健檢優惠資訊',
    onCardClick: () => {
      alert('You click card')
    }
  },
  {
    id:3,
    img: '/img/news_photo_3.png',
    tagName: '醫療新知',
    newsDate: '2025.01.12',
    newsTitle: '年節寵物飲食注意事項',
    onCardClick: () => {
      alert('You click card')
    }
  },
]

const Card = ({ props }) => {
  const { img, tagName, newsDate, newsTitle, onCardClick } = props

  return (
    <div className={styles.card} onClick={onCardClick}>
      <div className={styles.cardImg}>
        <img src={img} alt="news_photo" className={styles.img} />
      </div>
      <div className={styles.content}>
        {(tagName === '診所公告') && <p className={styles.cardTagPost}>{tagName}</p>}
        {(tagName === '優惠訊息') && <p className={styles.cardTagInfo}>{tagName}</p>}
        {(tagName === '醫療新知') && <p className={styles.cardTagKnow}>{tagName}</p>}
        <p className={styles.cardTime}>{newsDate}</p>
        <p className={styles.cardTitle}>{newsTitle}</p>
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
        {news.map((newsItem) => {
          return <Card props={newsItem} key={newsItem.id}/>
        })}
      </Slider>
    </div>
  )
}


const NewsSection = () => {
  const device = useDevice()

  const handleMoreBtnClick = () => {
    alert('You click more btn')
  }

  return (
    <section className={styles.container} id="news">
      <div className={styles.wrapper}>
        <div className={styles.titleContainer}>
          <div className={styles.titleGroup}>
            <img
              src="/svg/home_footprint.svg"
              alt="icon"
              className={styles.footprint}
            />
            <h2 className={styles.title}>Latest News</h2>
          </div>
          <h3 className={styles.subtitle}>最新消息</h3>
          <CardSlider />
          {device !== deviceParams.tablet && (
            <PrimaryButton title={"查看更多"} onClick={handleMoreBtnClick} />
          )}
        </div>
        <div className={styles.body}>
          <div className={styles.cardList}>
            {news.map((newsItem) => {
              return <Card props={newsItem} key={newsItem.id} />;
            })}
          </div>
        {device === deviceParams.tablet && (
          <PrimaryButton title={"查看更多"} onClick={handleMoreBtnClick} />
        )}
        </div>
      </div>
    </section>
  );
}

export default NewsSection;