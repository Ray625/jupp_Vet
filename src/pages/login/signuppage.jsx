import { useNavigate } from 'react-router-dom';
import { LoginContainer, LeftSide, RightSide, TitleGroup, GoogleBtn, FormGroup,InputGroup } from '../../components/login/login';
import styles from './signuppage.module.scss'
import { useState } from "react";
import useAuth from '../../hooks/useAuth';
import Loading from '../../components/loading/loading';


const SignupPage = () => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [checkedTerms, setCheckedTerms] = useState(false);
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
      return alert('請輸入姓氏')
    }
    if(!firstName) {
      return alert('請輸入名字')
    }
    if(!email) {
      return alert('請輸入Email')
    }
    if(!password) {
      return alert('請輸入密碼')
    }
    if(password.length > 12 || password.length < 8) {
      return alert('請輸入8-12位英數混合之密碼')
    }
    if(checkedTerms === false) {
      return alert('請同意 服務條款 與 隱私權政策')
    }
    emailRegister({ email, password, firstName, lastName })
  }

  return (
    <LoginContainer>
      {isLoading &&
        <Loading
          position={'fixed'}
          height={'100vh'}
          width={'100vw'}
          background={'#ffffff50'}
        />
      }
      <LeftSide
        describe={`Your pet's health is our `}
        focus={'priority'}
        img={'url(/img/signup_background.png)'}
      />
      <RightSide>
        <TitleGroup
          title={'會員註冊'}
          point={'已經成為會員?'}
          point2={'登入'}
          onClick={handleLoginClick}
        />
        <GoogleBtn
          title={'註冊'}
          onClick={handleGoogleSignup}
          />
        <FormGroup btnText={'註冊'} onSubmit={onSubmit}>
          <div className={styles.nameGroup}>
            <InputGroup
              title={'姓氏'}
              name={'lastName'}
              type={'lastName'}
              placeholder={'請輸入您的姓氏'}
              value={lastName}
              autocomplete={'family-name'}
              onChange={(e) => setLastName(e.target.value)}
            />
            <InputGroup
              title={'名字'}
              name={'firstName'}
              type={'firstName'}
              placeholder={'請輸入您的名字'}
              value={firstName}
              autocomplete={'given-name'}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <InputGroup
            title={'Email'}
            name={'email'}
            type={'email'}
            placeholder={'請輸入您的電子信箱'}
            value={email}
            autocomplete={'email'}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputGroup
            title={'密碼'}
            name={'password'}
            type={'password'}
            placeholder={'請輸入8-12位英數混合之密碼'}
            value={password}
            autocomplete={'new-password'}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={styles.termGroup}>
            <input type="checkbox" name="terms" id="terms" className={styles.checkbox} checked={checkedTerms} onClick={() => setCheckedTerms(!checkedTerms)}/>
            <p className={styles.describe}>我同意 <span onClick={() => alert('服務條款')}>服務條款</span> 與 <span onClick={() => alert('隱私權政策')}>隱私權政策</span></p>
          </div>
        </FormGroup>
      </RightSide>
    </LoginContainer>
  )
}

export default SignupPage;