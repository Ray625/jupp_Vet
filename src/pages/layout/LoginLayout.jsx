import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import useDevice from "../../hooks/useDevice";
import { deviceParams } from "../../utils/const";
import styles from './Layout.module.scss';
import { Outlet } from "react-router-dom"


const LoginLayout = () => {
  const device = useDevice();

  return (
    <div className={styles.container}>
      {(device === deviceParams.mobile || device === deviceParams.tablet) && (
        <Header />
      )}
      <Outlet />
      {(device === deviceParams.mobile || device === deviceParams.tablet) && (
        <Footer />
      )}
    </div>
  );
}

export default LoginLayout;
