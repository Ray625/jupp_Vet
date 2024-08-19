import styles from './footer.module.scss';

const IconGroup = ({wrapperClassName, className, svg, content}) => {
  return (
    <div className={styles.iconGroup}>
      <span className={wrapperClassName}>
        <object data={`/svg/icon_` + svg +`.svg`} className={className} aria-label="icon"> </object>
      </span>
      <p className={styles.infoContent}>{content}</p>
    </div>
  )
}

const InfoGroup = () => {
  return (
    <div className={styles.infoGroup}>
      <IconGroup
        wrapperClassName={styles.iconPhoneWrapper}
        className={styles.iconPhone}
        svg={'phone'}
        content={'02 2345 6789'}
      />
      <IconGroup
        wrapperClassName={styles.iconTimeWrapper}
        className={styles.iconTime}
        svg={'time'}
        content={'Mon - Sun 10:00 am - 21:00 pm'}
      />
      <IconGroup
        wrapperClassName={styles.iconPinWrapper}
        className={styles.iconPin}
        svg={'pin'}
        content={'116台北市文山區新光路二段8號'}
      />
    </div>
  )
}

const SideMapGroup = ({ title, items }) => {
  return (
    <div className={styles.sideMapGroup}>
      <p className={styles.sideMapeTitle}>{title}</p>
      <ul className={styles.sideMapeList}>
        {items.map(item => <li className={styles.sideMapeItem} key={item}>{item}</li>)}
      </ul>
    </div>
  )
}

const Footer = () => {
  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.logo}></div>
        <div className={styles.content}>
          <p className={styles.describe}>Caring for your pets like family.</p>
          <p className={styles.copyright}>Copyright © 2024 JP Pet Clinic All rights reserved.</p>
        </div>
        <div className={styles.sideMap}>
          <SideMapGroup
            title={'關於我們'}
            items={['經營理念', '專業團隊', '診所資訊']}
          />
          <SideMapGroup
            title={'服務項目'}
            items={['內科', '外科', '其他專科']}
          />
          <SideMapGroup
            title={'最新消息'}
            items={['診所公告', '優惠訊息', '醫療新知']}
          />
          <SideMapGroup
            title={'聯絡我們'}
            items={['交通指南', '聯絡表單']}
          />
        </div>
        <InfoGroup />
      </div>
    </section>
  )
}

export default Footer;
export { InfoGroup };