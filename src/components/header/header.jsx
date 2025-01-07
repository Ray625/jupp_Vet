import styles from './header.module.scss';
import { useRef, useState, forwardRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PrimaryButton } from '../button/button';
import { InfoGroup } from '../footer/footer';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import useDevice from '../../hooks/useDevice';
import { deviceParams } from '../../utils/const';

const MobileMenu = forwardRef(
  ({ setHamburgerClose, currentUser, handleSignOut }, ref) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
      <div className={styles.closedMenu} ref={ref}>
        <div className={styles.topSide} onClick={setHamburgerClose}>
          <div
            onClick={() => navigate("/")}
            className={
              location.pathname === "/" && location.hash === ""
                ? styles.active
                : styles.entry
            }
          >
            {location.pathname === "/" && location.hash === "" && (
              <img
                src="svg/footprint.svg"
                alt="footprint"
                className={styles.activeImg}
              />
            )}
            首頁
          </div>
          <div
            className={`${location.hash === "#about" && styles.active} ${
              styles.entry
            }`}
          >
            {location.hash === "#about" && (
              <img
                src="svg/footprint.svg"
                alt="footprint"
                className={styles.activeImg}
              />
            )}
            <a href="/#about">關於我們</a>
          </div>
          <div
            className={`${location.hash === "#offer" && styles.active} ${
              styles.entry
            }`}
          >
            {location.hash === "#offer" && (
              <img
                src="svg/footprint.svg"
                alt="footprint"
                className={styles.activeImg}
              />
            )}
            <a href="/#offer">服務項目</a>
          </div>
          <div
            className={`${location.hash === "#news" && styles.active} ${
              styles.entry
            }`}
          >
            {location.hash === "#news" && (
              <img
                src="svg/footprint.svg"
                alt="footprint"
                className={styles.activeImg}
              />
            )}
            <a href="/#news">最新消息</a>
          </div>
          <div
            className={`${location.hash === "#photo" && styles.active} ${
              styles.entry
            }`}
          >
            {location.hash === "#photo" && (
              <img
                src="svg/footprint.svg"
                alt="footprint"
                className={styles.activeImg}
              />
            )}
            <a href="/#photo">照片集</a>
          </div>
          <div
            className={`${location.hash === "#info" && styles.active} ${
              styles.entry
            }`}
          >
            {location.hash === "#info" && (
              <img
                src="svg/footprint.svg"
                alt="footprint"
                className={styles.activeImg}
              />
            )}
            <a href="/#info">交通指南</a>
          </div>
          {currentUser && currentUser?.email === "admin001@gmail.com" && (
            <div
              className={styles.entry}
              onClick={() => {
                navigate("/backstage");
                setHamburgerClose();
              }}
            >
              後台
            </div>
          )}
          {currentUser && currentUser?.email !== "admin001@gmail.com" && (
            <div
              className={`${location.pathname === "/user" && styles.active} ${
                styles.entry
              }`}
              onClick={() => {
                navigate("/user");
                setHamburgerClose();
              }}
            >
              會員中心
            </div>
          )}
        </div>
        <div className={styles.bottomSide}>
          <button
            className={styles.bookBtn}
            onClick={() => {
              navigate("/booking");
              setHamburgerClose();
            }}
          >
            立即預約
          </button>
          {currentUser ? (
            <button
              onClick={() => {
                handleSignOut();
                setHamburgerClose();
              }}
              className={styles.loginBtn}
            >
              登出
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setHamburgerClose();
              }}
              className={styles.loginBtn}
            >
              登入
            </button>
          )}
        </div>
        <div className={styles.infoWrapper}>
          <InfoGroup />
        </div>
      </div>
    );
  }
);

MobileMenu.displayName = 'MobileMenu';

const Header = () => {
  const [ hamburgerOpen, setHamburgerOpen ] = useState(false)
  const hamburgerRef = useRef(null)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const { tickerOpen } = useTheme()
  const device = useDevice()

  useEffect(() => {
    // mobileMenu打開時，外部畫面禁止滑動
    if(hamburgerOpen) {
      document.body.style.overflow = 'hidden';
      hamburgerRef.current.className = styles.closeBtn;
      menuRef.current.className = styles.mobileMenu;
    } else {
      document.body.style.overflow = 'auto';
      hamburgerRef.current.className = styles.hamburgerBtn;
      menuRef.current.className = styles.closedMenu;
    }
  }, [hamburgerOpen])

  // 小螢幕切換至大螢幕時，自動將mobileMenu關閉，以防螢幕被鎖住無法上下滾動
  useEffect(() => {
    if (device === deviceParams.pc || device === deviceParams.laptop) {
      setHamburgerOpen(false)
    }
  }, [device]);

  const handleSignOut = () => {
    logout()
  }

  const handleBookingeBtnClick = () => {
    navigate('/booking')
  }

  const handleHamburgerClick = () => {
    setHamburgerOpen(!hamburgerOpen)
  }

  const handleLogeClick = () => {
    navigate('/')
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <div
      className={styles.container}
      style={{ top: tickerOpen ? "44px" : "0" }}
    >
      <div className={styles.wrapper}>
        <div className={styles.logo} onClick={handleLogeClick}></div>
        <div className={styles.navbarList}>
          <div className={styles.navbarEntry}>
            <a href="/#home">首頁</a>
          </div>
          <div className={styles.navbarEntry}>
            <a href="/#about">關於我們</a>
          </div>
          <div className={styles.navbarEntry}>
            <a href="/#offer">服務項目</a>
          </div>
          <div className={styles.navbarEntry}>
            <a href="/#news">最新消息</a>
          </div>
          <div className={styles.navbarEntry}>
            <a href="/#photo">照片集</a>
          </div>
          <div className={styles.navbarEntry}>
            <a href="/#info">交通指南</a>
          </div>
        </div>
        <div className={styles.btnGroup}>
          <PrimaryButton title={"立即預約"} onClick={handleBookingeBtnClick} />
          {currentUser ? (
            <div className={styles.userCenter}>
              <img
                src="/img/user.png"
                alt="user_icon"
                className={styles.userCenterIcon}
              />
              <div className={styles.userMenu}>
                {currentUser.email === "admin001@gmail.com" && (
                  <div
                    onClick={() => {
                      navigate("/backstage");
                    }}
                  >
                    後台
                  </div>
                )}
                {currentUser.email !== "admin001@gmail.com" && (
                  <div
                    onClick={() => {
                      navigate("/user");
                    }}
                  >
                    會員中心
                  </div>
                )}
                <div onClick={handleSignOut} className={styles.logout}>
                  登出
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => {
                navigate("/login");
              }}
              className={styles.login}
            >
              登入
            </div>
          )}
        </div>
        <div
          className={styles.hamburgerContainer}
          onClick={handleHamburgerClick}
        >
          <div className={styles.hamburgerBtn} ref={hamburgerRef}></div>
        </div>
        <MobileMenu
          setHamburgerClose={handleHamburgerClick}
          currentUser={currentUser}
          handleSignOut={handleSignOut}
          ref={menuRef}
        />
      </div>
    </div>
  );
}

export default Header;