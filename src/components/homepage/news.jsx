import { PrimaryButton } from "../button/button";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import styles from './news.module.scss';

const news = [{
    id:1,
    img: '/img/news_photo_1.png',
    tagName: '診所公告',
    newsDate: '2024.01.31',
    newsTitle: '2024 春節營業時間調整公告',
    onCardClick: () => {
      alert('You click card')
    },
    onBtnClick: (event) => {
      event.stopPropagation()
      alert('You click more btn')
    }
  },
  {
    id:2,
    img: '/img/news_photo_2.png',
    tagName: '優惠訊息',
    newsDate: '2024.01.15',
    newsTitle: '2024 健檢優惠資訊',
    onCardClick: () => {
      alert('You click card')
    },
    onBtnClick: (event) => {
      event.stopPropagation()
      alert('You click more btn')
    }
  },
  {
    id:3,
    img: '/img/news_photo_3.png',
    tagName: '醫療新知',
    newsDate: '2024.01.12',
    newsTitle: '年節寵物飲食注意事項',
    onCardClick: () => {
      alert('You click card')
    },
    onBtnClick: (event) => {
      event.stopPropagation()
      alert('You click more btn')
    }
  },
]

const MoreButton = ({ onClick }) => {
  return (
    <button className={styles.moreBtn} onClick={onClick}>
        <i className="fa-solid fa-arrow-right"></i>
    </button>
  )
}

const Card = ({ props }) => {
  const { img, tagName, newsDate, newsTitle, onCardClick, onBtnClick } = props

  return (
    <div className={styles.card} onClick={onCardClick}>
      <div className={styles.cardImg}>
        <img src={[img]} alt="news_photo" />
      </div>
      <div className={styles.content}>
        {(tagName === '診所公告') && <p className={styles.cardTagPost}>{tagName}</p>}
        {(tagName === '優惠訊息') && <p className={styles.cardTagInfo}>{tagName}</p>}
        {(tagName === '醫療新知') && <p className={styles.cardTagKnow}>{tagName}</p>}
        <p className={styles.cardTime}>{newsDate}</p>
        <p className={styles.cardTitle}>{newsTitle}</p>
      </div>
    <MoreButton onClick={onBtnClick} />
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
          <h3 className={styles.subtitle}>最新資訊</h3>
          <CardSlider />
          <PrimaryButton title={"查看更多"} onClick={handleMoreBtnClick} />
        </div>
        <div className={styles.body}>
          <div className={styles.cardList}>
            {news.map((newsItem) => {
              return <Card props={newsItem} key={newsItem.id} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewsSection;