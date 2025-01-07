import styles from "./UserPageLayout.module.scss";
import { Container } from "../../components/booking/booking";
import { Menu, Wrapper } from "../../components/user/user";
import useTheme from "../../hooks/useTheme";
import { Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
  const { tickerOpen } = useTheme();
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  console.log("currentUser", currentUser);

  useEffect(() => {
    if (!currentUser) {
      navigate('/')
    }
  })

  return (
    <div
      className={styles.container}
      style={{ paddingTop: tickerOpen ? "124px" : "80px" }}
    >
      <Container
        title="Member Center"
        subitle="會員中心"
        titleBgClassName={styles.userBg}
        containerBgClassName={styles.containerBg}
      >
        <Wrapper>
          <Menu />
          <Outlet />
        </Wrapper>
      </Container>
    </div>
  );
}

export default UserPage