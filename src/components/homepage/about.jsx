import styles from './about.module.scss';

const IconGroup = ({className, svg, content}) => {
  return (
    <div className={styles.iconGroup}>
      <span className={className}>
        <object data={`/svg/icon_` + svg +`.svg`} className={styles.icon} aria-label="icon"> </object>
      </span>
      <p>{content}</p>
    </div>
  )
}

const AboutSection = () => {
  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.img}></div>
        <div className={styles.body}>
          <h2 className={styles.title}>
            <object data="/svg/home_footprint.svg" className={styles.footprint} aria-label="footprint"> </object>
            About us
          </h2>
          <h3 className={styles.subtitle}>
            為愛與關懷而生，<br/>
            致力於寵物醫療健康
          </h3>
          <p className={styles.content}>
            我們的專業團隊以愛心和責任感為每一位毛孩提供最好的護理。無論是緊急治療、預防保健還是手術，我們都以最先進的設備和技術為您的寵物提供最佳照顧。
          </p>
          <div className={styles.mobileIconContainer}>
            <div className={styles.iconList}>
              <IconGroup
                className={styles.iconHeartWrapper}
                svg={'heart'}
                content={'全面服務'}
                />
              <IconGroup
                className={styles.iconTeamWrapper}
                svg={'team'}
                content={'專業團隊'}
                />
              <IconGroup
                className={styles.iconToolWrapper}
                svg={'tool'}
                content={'先進設備'}
                />
            </div>
            <div className={styles.mobileImg}></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection;