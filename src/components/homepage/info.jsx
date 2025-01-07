import styles from './info.module.scss'

const IconGroup = ({ svg, content}) => {
  return (
    <div className={styles.iconGroup}>
      <div className={styles.iconWrapper}>
        <img
          src={svg}
          alt="icon"
          className={styles.icon }
        />
      </div>
      <p className={styles.infoContent}>{content}</p>
    </div>
  );
}

const InfoSection = () => {
  return (
    <section className={styles.container} id="info">
      <div className={styles.wrapper}>
        <div className={styles.infoSide}>
          <div className={styles.titleContainer}>
            <div className={styles.titleGroup}>
              <img
                src="/svg/home_footprint.svg"
                alt="icon"
                className={styles.footprint}
              />
              <h2 className={styles.title}>Infomation</h2>
            </div>
            <h3 className={styles.subtitle}>交通指南</h3>
            <p className={styles.describe}>
              我們位於台北市立動物園旁，附近有數個停車場。若家中毛孩有任何異狀，請盡速與本院聯絡或線上預約。
            </p>
          </div>
          <div className={styles.infoGroup}>
            <IconGroup
              svg={"/svg/icon_phone.svg"}
              content={"02 2345 6789"}
            />
            <IconGroup
              svg={"/svg/icon_time.svg"}
              content={"Mon - Sat 10:00 am - 21:00 pm"}
            />
            <IconGroup
              svg={"/svg/icon_pin.svg"}
              content={"116台北市文山區新光路二段8號"}
            />
          </div>
        </div>
        <div className={styles.mapSide}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1590.2418086191021!2d121.57536631490653!3d24.996977295230206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442aa640ddea4d1%3A0xa4be333a46a96053!2z5YuV54mp5ZyS56uZ!5e0!3m2!1szh-TW!2stw!4v1709770702621!5m2!1szh-TW!2stw"
            className={styles.googleMap}
            title="map"
            allowfullscreen="true"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          >
            {" "}
          </iframe>
        </div>
      </div>
    </section>
  );
}

export default InfoSection;