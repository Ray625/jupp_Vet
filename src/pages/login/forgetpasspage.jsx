import { useNavigate } from 'react-router-dom';
import { LoginContainer, LeftSide, RightSide, TitleGroup, FormGroup,InputGroup } from '../../components/login/login';
import styles from './forgetpasspage.module.scss'

const ForgetPassPage = () => {
  const navigate = useNavigate()

  return (
    <LoginContainer>
      <LeftSide
        describe={'Forgot your password?'}
        img={'url(/img/forgetpass_background.png)'}
      />
      <RightSide>
        <TitleGroup
          title={'忘記密碼'}
        />
        <p className={styles.describe}>輸入您加入時使用的電子郵件地址，我們將向您發送重置密碼的連結。</p>
        <FormGroup btnText={'送出'}>
          <InputGroup
            title={'Email'}
            name={'email'}
            type={'email'}
            placeholder={'請輸入您的電子信箱'}
          />
        </FormGroup>
        <div className={styles.back} onClick={() => navigate('/login')}>返回登入</div>
      </RightSide>
    </LoginContainer>
  )
}

export default ForgetPassPage;

