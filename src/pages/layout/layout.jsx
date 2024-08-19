import styles from './layout.module.scss';
import Header from "../../components/header/header";
import Footer from '../../components/footer/footer';
import { Outlet } from "react-router-dom";
// import useTheme from "../../hooks/useTheme";

const Layout = () => {
  // const {tickerOpen, setTickerOpen} = useTheme()

  // const handleTickerCloseBtnClick = () => {
  //   setTickerOpen(false)
  // }

  return (
    <div className={styles.container}>
      {/* {tickerOpen && <Ticker onClick={handleTickerCloseBtnClick}/>} */}
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout;