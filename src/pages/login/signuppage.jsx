import { useNavigate } from 'react-router-dom';
import {
  LoginContainer,
  LeftSide,
  RightSide,
  TitleGroup,
  GoogleBtn,
  FormGroup,
  InputGroup,
  PasswordInput,
} from "../../components/login/login";
import styles from "./SignupPage.module.scss";
import { useState } from "react";
import useAuth from '../../hooks/useAuth';
import Loading from '../../components/loading/loading';
import { OneBtnAlert } from "../../components/alert/alert";


const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkedTerms, setCheckedTerms] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState("");
  const navigate = useNavigate()

  const {emailRegister, googleLogin, isLoading} = useAuth()

  const handleLoginClick = () => {
    navigate('/login')
  }

  const handleGoogleSignup = () => {
    googleLogin()
  }


  const onSubmit = (e) => {
    e.preventDefault()
    if(!lastName) {
      setAlertText("請輸入姓氏");
      setAlertOpen(true);
      return
    }
    if(!firstName) {
      setAlertText("請輸入名字");
      setAlertOpen(true);
      return;
    }
    if(!email) {
      setAlertText("請輸入Email");
      setAlertOpen(true);
      return;
    }
    if(!password) {
      setAlertText("請輸入密碼");
      setAlertOpen(true);
      return;
    }

    const isValidPassword = (password) => {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;
      return regex.test(password);
    };

    if (!isValidPassword(password)) {
      setAlertText("請輸入8-12位英數混合之密碼");
      setAlertOpen(true);
      return;
    }
    if(password.length > 12 || password.length < 8) {
      setAlertText("請輸入8-12位英數混合之密碼");
      setAlertOpen(true);
      return;
    }
    if(checkedTerms === false) {
      setAlertText("請同意 服務條款 與 隱私權政策");
      setAlertOpen(true);
      return;
    }
    emailRegister({ email, password, firstName, lastName })
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
          describe={`Your pet's health is our `}
          focus={"priority"}
          img={"url(/img/signup_background.png)"}
        />
        <RightSide>
          <TitleGroup
            title={"會員註冊"}
            point={"已經成為會員?"}
            point2={"登入"}
            onClick={handleLoginClick}
          />
          <GoogleBtn title={"註冊"} onClick={handleGoogleSignup} />
          <FormGroup btnText={"註冊"} onSubmit={onSubmit}>
            <div className={styles.nameGroup}>
              <InputGroup
                title={"姓氏"}
                name={"lastName"}
                type={"lastName"}
                placeholder={"請輸入您的姓氏"}
                value={lastName}
                autocomplete={"family-name"}
                onChange={(e) => setLastName(e.target.value)}
              />
              <InputGroup
                title={"名字"}
                name={"firstName"}
                type={"firstName"}
                placeholder={"請輸入您的名字"}
                value={firstName}
                autocomplete={"given-name"}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <InputGroup
              title={"Email"}
              name={"email"}
              type={"email"}
              placeholder={"請輸入您的電子信箱"}
              value={email}
              autocomplete={"email"}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              title={"密碼"}
              name={"password"}
              placeholder={"請輸入8-12位英數混合之密碼"}
              value={password}
              autocomplete={"new-password"}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className={styles.termGroup}>
              <input
                type="checkbox"
                name="terms"
                id="terms"
                className={styles.checkbox}
                checked={checkedTerms}
                onChange={() => setCheckedTerms(!checkedTerms)}
              />
              <p className={styles.describe}>
                我同意 <span onClick={() => alert("服務條款")}>服務條款</span>{" "}
                與 <span onClick={() => alert("隱私權政策")}>隱私權政策</span>
              </p>
            </div>
          </FormGroup>
        </RightSide>
      </LoginContainer>
    </>
  );
}

export default SignupPage;