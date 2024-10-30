import { useNavigate } from "react-router-dom";
import { LoginContainer, LeftSide, RightSide, TitleGroup, GoogleBtn, FormGroup, InputGroup } from '../../components/login/login';
import styles from "./LoginPage.module.scss";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/loading/loading";
import { OneBtnAlert } from "../../components/alert/alert";


const LoginPage = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertText, setAlertText] = useState('')
  const navigate = useNavigate();

  const {emailLogin, googleLogin, isLoading} = useAuth()

  const handleSignUpClick = () => {
    navigate('/signup')
  }

  const handleGoogleLogin = () => {
    googleLogin()
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if(!email) {
      setAlertText("請輸入Email")
      setAlertOpen(true);
      return
    }
    if(!password) {
      setAlertText("請輸入密碼");
      setAlertOpen(true);
      return
    }
    emailLogin({ email, password })
  }

  return (
    <>
      {alertOpen && (
        <OneBtnAlert
          title={alertText}
          button={"確認"}
          handleClose={() => setAlertOpen(false)}
          handleConfirm={() => setAlertOpen(false)}
        />
      )}
      <LoginContainer>
        {isLoading && (
          <Loading
            position={"fixed"}
            height={"100vh"}
            width={"100vw"}
            background={"#ffffff50"}
          />
        )}
        <LeftSide
          describe={"Caring for your pets like"}
          focus={"family"}
          img={"url(/img/login_background.png)"}
        />
        <RightSide>
          <TitleGroup
            title={"會員登入"}
            point={"尚未成為會員?"}
            point2={"註冊"}
            onClick={handleSignUpClick}
          />
          <GoogleBtn title={"登入"} onClick={handleGoogleLogin} />
          <FormGroup btnText={"登入"} onSubmit={onSubmit}>
            <InputGroup
              title={"Email"}
              name={"email"}
              type={"email"}
              placeholder={"請輸入您的電子信箱"}
              value={email}
              autocomplete={"email"}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputGroup
              title={"密碼"}
              name={"password"}
              type={"password"}
              placeholder={"請輸入8-12位英數混合之密碼"}
              value={password}
              autocomplete={"current-password"}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
          <div
            className={styles.forgetPass}
            onClick={() => navigate("/forget-pass")}
          >
            忘記密碼?
          </div>
        </RightSide>
      </LoginContainer>
    </>
  );
}

export default LoginPage;
