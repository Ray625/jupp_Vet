import styles from './info.module.scss'

const IconGroup = ({className, svg, content}) => {
  return (
    <div className={styles.iconGroup}>
      <span className={styles.iconWrapper}>
        <object data={`/svg/icon_` + svg +`.svg`} className={className} aria-label="icon"> </object>
      </span>
      <p className={styles.infoContent}>{content}</p>
    </div>
  )
}

const InfoSection = () => {
  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.infoSide}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>
              <object data="/svg/home_footprint.svg" className={styles.footprint} aria-label="footprint"> </object>
              Infomation
            </h2>
            <h3 className={styles.subtitle}>本院資訊</h3>
            <p className={styles.describe}>我們位於台北市立動物園旁，附近有數個停車場。若家中毛孩有任何異狀，請盡速與本院聯絡或線上預約。</p>
          </div>
          <div className={styles.infoGroup}>
            <IconGroup
              className={styles.iconPhone}
              svg={'phone'}
              content={'02 2345 6789'}
            />
            <IconGroup
              className={styles.iconTime}
              svg={'time'}
              content={'Mon - Sun 10:00 am - 21:00 pm'}
            />
            <IconGroup
              className={styles.iconPin}
              svg={'pin'}
              content={'116台北市文山區新光路二段8號'}
            />
          </div>
        </div>
        <div className={styles.mapSide}>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1590.2418086191021!2d121.57536631490653!3d24.996977295230206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442aa640ddea4d1%3A0xa4be333a46a96053!2z5YuV54mp5ZyS56uZ!5e0!3m2!1szh-TW!2stw!4v1709770702621!5m2!1szh-TW!2stw" className={styles.googleMap} title='map' allowfullscreen="true" loading="lazy" referrerPolicy="no-referrer-when-downgrade"> </iframe>
        </div>
      </div>
    </section>
  )
}

export default InfoSection;