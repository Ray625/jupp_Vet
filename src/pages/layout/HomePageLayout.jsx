import Ticker from '../../components/ticker/ticker';
import Header from "../../components/header/header";
import Footer from '../../components/footer/footer';
import useTheme from "../../hooks/useTheme";
import styles from './Layout.module.scss';
import { Outlet } from "react-router-dom";

const HomePageLayout = () => {
  const { tickerOpen, setTickerOpen } = useTheme();

  const handleTickerCloseBtnClick = () => {
    setTickerOpen(false);
  };

  return (
    <div className={styles.container}>
      {tickerOpen && <Ticker onClick={handleTickerCloseBtnClick} />}
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default HomePageLayout;