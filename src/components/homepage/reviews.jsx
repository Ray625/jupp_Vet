import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import styles from './reviews.module.scss';

const cardList = [
  {
    id: 1,
    photo: "/img/owner_photo_1.png",
    petName: 'Lucky',
    ownerName: '林小姐',
    bodyContent: '他們的專業和關懷讓我感到非常安心，我寵物的健康問題都得到了很好的解決。'
  },
  {
    id: 2,
    photo: "/img/owner_photo_2.png",
    petName: '胖胖',
    ownerName: '陳先生',
    bodyContent: '每次來這裡都感受到他們對寵物的愛和關懷，我完全信任他們的治療方案。'
  },
  {
    id: 3,
    photo: "/img/owner_photo_3.png",
    petName: '小橘',
    ownerName: '孫小姐',
    bodyContent: '他們不僅提供醫療服務，還給予了我很多寵物養育的建議，讓我感到很窩心。'
  },
  {
    id: 4,
    photo: "/img/owner_photo_1.png",
    petName: '歐歐',
    ownerName: '許先生',
    bodyContent: '動物醫院的服務態度非常親切，他們會主動關心寵物的情況，讓我感受到他們對動物的愛與責任心。'
  },
  {
    id: 5,
    photo: "/img/owner_photo_2.png",
    petName: '大龍',
    ownerName: '陳小姐',
    bodyContent: '動物醫院的設施乾淨整潔，讓我放心把寵物交給他們，感謝他們對寵物健康的專業關注。'
  },
  {
    id: 6,
    photo: "/img/owner_photo_3.png",
    petName: 'QQ',
    ownerName: '劉小姐',
    bodyContent: '在這裡得到的治療效果非常好，寵物復原速度快，我對動物醫院的服務和治療效果非常滿意。'
  },
]

const Card = ({ props }) => {
  const { id, photo, petName, ownerName, bodyContent } = props

  if (id % 2 === 1) {
    return (
      <div className={styles.cardOdd}>
      {(id % 3 === 1) && <img src="svg/icon_dot_blue.svg" className={styles.iconDot} alt="icon_dot" />}
      {(id % 3 === 2) && <img src="svg/icon_dot_green.svg" className={styles.iconDot} alt="icon_dot" />}
      {(id % 3 === 0) && <img src="svg/icon_dot_orange.svg" className={styles.iconDot} alt="icon_dot" />}
      <div className={styles.cardProfile}>
        <img src={[photo]} alt="owner_photo" className={styles.cardPhoto}/>
        <div className={styles.cardName}>
          <p className={styles.petName}>{petName}</p>
          <p className={styles.ownerName}>{ownerName}</p>
        </div>
      </div>
      <p className={styles.cardBody}>{bodyContent}</p>
    </div>
    )
  }

  return (
      <div className={styles.cardEven}>
      {(id % 3 === 1) && <img src="svg/icon_dot_blue.svg" className={styles.iconDot} alt="icon_dot" />}
      {(id % 3 === 2) && <img src="svg/icon_dot_green.svg" className={styles.iconDot} alt="icon_dot" />}
      {(id % 3 === 0) && <img src="svg/icon_dot_orange.svg" className={styles.iconDot} alt="icon_dot" />}
      <div className={styles.cardProfile}>
        <img src={[photo]} alt="owner_photo" className={styles.cardPhoto}/>
        <div className={styles.cardName}>
          <p className={styles.petName}>{petName}</p>
          <p className={styles.ownerName}>{ownerName}</p>
        </div>
      </div>
      <p className={styles.cardBody}>{bodyContent}</p>
    </div>
  )
}

const CardSlider = () => {
  const settings = {
    arrows: false,
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 5000,
    easing: "ease",
    responsive: [
      {
        breakpoint: 480,
        settings: {
          speed: 1000,
          autoplaySpeed: 3000,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.cardSlider}>
      <Slider {...settings}>
        {cardList.map((card, index) => {
          return <Card props={card} key={index}/>
        })}
      </Slider>
    </div>
  )
}

const ReviewsSection = () => {

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.titleGroup}>
          <object data="/svg/home_footprint.svg" className={styles.footprint} aria-label="footprint"> </object>
          <h2 className={styles.title}>
            Customer Ravers
          </h2>
          <h3 className={styles.subtitle}>
            用心服務，感動每一刻
          </h3>
        </div>
        <CardSlider />
      </div>
    </section>
  )
}

export default ReviewsSection;