import styles from './homepage_layout.module.scss';
import { Outlet } from "react-router-dom"
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import { deviceParams } from "../../utils/const";
import useDevice from "../../hooks/useDevice";


const LoginLayout = () => {
  const device = useDevice();

  return (
    <div className={styles.container}>
      {device === deviceParams.mobile && <Header />}
      <Outlet />
      {device === deviceParams.mobile && <Footer />}
    </div>
  );
}

export default LoginLayout;
