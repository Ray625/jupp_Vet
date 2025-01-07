import styles from './footer.module.scss';
import { useNavigate } from 'react-router-dom';

const IconGroup = ({wrapperClassName, className, svg, content}) => {
  return (
    <div className={styles.iconGroup}>
      <div className={wrapperClassName}>
        <img src={svg} alt="icon" className={className} />
      </div>
      <p className={styles.infoContent}>{content}</p>
    </div>
  );
}

const InfoGroup = () => {
  return (
    <div className={styles.infoGroup}>
      <IconGroup
        wrapperClassName={styles.iconPhoneWrapper}
        className={styles.iconPhone}
        svg={"/svg/icon_phone.svg"}
        content={"02 2345 6789"}
      />
      <IconGroup
        wrapperClassName={styles.iconTimeWrapper}
        className={styles.iconTime}
        svg={"/svg/icon_time.svg"}
        content={"Mon - Sun 10:00 am - 21:00 pm"}
      />
      <IconGroup
        wrapperClassName={styles.iconPinWrapper}
        className={styles.iconPin}
        svg={"/svg/icon_pin.svg"}
        content={"116台北市文山區新光路二段8號"}
      />
    </div>
  );
}

const SideMapGroup = ({ title, items, links = null, tag = null }) => {
  const navigate = useNavigate()

  return (
    <div className={styles.sideMapGroup}>
      <p className={styles.sideMapeTitle}>{title}</p>
      <ul className={styles.sideMapeList}>
        {items.map((item, index) => (
          <li className={styles.sideMapeItem} key={item}>
            {tag && (
              <a href={tag[index]} className={styles.link}>
                {item}
              </a>
            )}
            {links && (
              <div
                className={styles.link}
                onClick={() => {
                  navigate(links[index]);
                }}
              >
                {item}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Footer = () => {
  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.logo}></div>
        <div className={styles.content}>
          <p className={styles.describe}>Caring for your pets like family.</p>
          <p className={styles.copyright}>
            Copyright © 2024 JP Pet Clinic All rights reserved.
          </p>
        </div>
        <div className={styles.sideMap}>
          <SideMapGroup
            title={"關於我們"}
            items={["經營理念"]}
            tag={["/#about"]}
          />
          <SideMapGroup
            title={"服務項目"}
            items={["內科", "外科"]}
            tag={["/#offer", "/#offer"]}
          />
          <SideMapGroup
            title={"最新消息"}
            items={["診所公告", "醫療新知"]}
            tag={["/#news", "/#news"]}
          />
          <SideMapGroup
            title={"聯絡我們"}
            items={["交通指南"]}
            tag={["/#info"]}
          />
          <SideMapGroup
            title={"會員中心"}
            items={["飼主資料", "寵物資料", "預約紀錄"]}
            links={[
              "/user",
              "/user/pets",
              "/user/records",
            ]}
          />
        </div>
        <InfoGroup />
      </div>
    </section>
  );
};

export default Footer;
export { InfoGroup };