import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  LoginContainer,
  LeftSide,
  RightSide,
  TitleGroup,
  FormGroup,
  InputGroup,
  PasswordInput,
} from "../../components/login/login";
import styles from "./ForgetPassPage.module.scss";
import { useEffect, useState } from 'react';
import {
  sendPasswordResetEmail,
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import { OneBtnAlert } from '../../components/alert/alert';

const ForgetPassPage = () => {
  const [email, setEmail] = useState("")
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertText, setAlertText] = useState("")
  const navigate = useNavigate()
  const auth = getAuth()

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.length === 0) return

    try {
      await sendPasswordResetEmail(auth, email)
      setAlertText('已將重設密碼郵件寄至信箱')
      setAlertOpen(true)
    } catch (error) {
      const errorCode = error.code
      console.log(errorCode)
      if (errorCode === "auth/invalid-email") {
        setAlertText('Email格式錯誤');
        setAlertOpen(true)
      }
    }
  }

  return (
    <LoginContainer>
      {alertOpen && (
        <OneBtnAlert
          title={alertText}
          button="確認"
          handleClose={() => setAlertOpen(false)}
          handleConfirm={() => {
            setAlertOpen(false)
            navigate('/login')
          }}
        />
      )}
      <LeftSide
        describe="Forgot your password?"
        img="url(/img/forgetpass_background.png)"
      />
      <RightSide>
        <TitleGroup title="忘記密碼" />
        <p className={styles.describe}>
          輸入您加入時使用的電子郵件地址，我們將向您發送重置密碼的連結。
        </p>
        <FormGroup btnText={"送出"} onSubmit={handleSubmit}>
          <InputGroup
            title="Email"
            name="email"
            type="email"
            placeholder="請輸入您的電子信箱"
            autocomplete="email"
            value={email}
            onChange={handleEmailChange}
          />
        </FormGroup>
        <div className={styles.back} onClick={() => navigate("/login")}>
          返回登入
        </div>
      </RightSide>
    </LoginContainer>
  );
}

const ResetPassPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [searchParams] = useSearchParams();
  const [oobCode, setOobCode] = useState("")
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    text: "",
    confirm: () => setAlertOpen(false)
  });
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const code = searchParams.get("oobCode")
    if (code) {
      setOobCode(code)
      verifyCode(code)
    } else {
      console.log("無效的重設密碼連結");
    }
  }, [searchParams]);

  const verifyCode = async (code) => {
    try {
      await verifyPasswordResetCode(auth, code);
    } catch (error) {
      console.error("驗證失敗", error)
    }
  }

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleconfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault()

    const isValidPassword = (password) => {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;
      return regex.test(password);
    };

    if (!isValidPassword(newPassword)) {
      setAlertConfig((prev) => { 
        return ({
          ...prev,
          text: "請設定為8-12位英數混合之密碼"
        })
      })
      setAlertOpen(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlertConfig((prev) => {
        return {
          ...prev,
          text: "新密碼與確認密碼不相符",
        };
      });
      setAlertOpen(true)
      return
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setAlertConfig({
        text: "密碼重設成功，請重新登入",
        confirm: () => {
          setAlertOpen(false)
          navigate('/login')
        }
      })
      setAlertOpen(true);
    } catch (error) {
      console.error("重設密碼失敗:", error);
      console.log("error.code", error.code);
      switch (error.code) {
        case "auth/invalid-action-code":
          setAlertConfig((prev) => {
            return {
              ...prev,
              text: "密碼重設連結無效或已過期，請重新申請重設密碼。",
            };
          });
          setAlertOpen(true);
          break;
        default:
          setAlertConfig((prev) => {
            return {
              ...prev,
              text: "重設密碼時發生錯誤，請稍後再試",
            };
          });
          setAlertOpen(true);
      }
    }
  }

  return (
    <LoginContainer>
      {alertOpen && (
        <OneBtnAlert
          title={alertConfig.text}
          button="確認"
          handleClose={() => setAlertOpen(false)}
          handleConfirm={alertConfig.confirm}
        />
      )}
      <LeftSide
        describe="Forgot your password?"
        img="url(/img/forgetpass_background.png)"
      />
      <RightSide>
        <TitleGroup title="重設密碼" />
        <p className={styles.describe}>
          輸入您加入時使用的電子郵件地址，我們將向您發送重置密碼的連結。
        </p>
        <FormGroup btnText={"送出"} onSubmit={handleResetPassword}>
          <PasswordInput
            title="新密碼"
            name="newPassword"
            type="password"
            placeholder="請輸入8-12位英數混合之密碼"
            autocomplete="off"
            value={newPassword}
            onChange={handlePasswordChange}
          />
          <PasswordInput
            title="確認新密碼"
            name="confirmPassword"
            type="password"
            placeholder="請再次輸入新密碼"
            autocomplete="off"
            value={confirmPassword}
            onChange={handleconfirmPasswordChange}
          />
        </FormGroup>
      </RightSide>
    </LoginContainer>
  );
}

export { ForgetPassPage, ResetPassPage };

