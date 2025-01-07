import styles from './login.module.scss';
import { useNavigate } from 'react-router-dom';
import useDevice from '../../hooks/useDevice';
import { deviceParams } from '../../utils/const';
import { useState } from 'react';

const LoginContainer = ({ children }) => {
  const device = useDevice();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>{children}</div>
      {(device === deviceParams.pc || device === deviceParams.laptop) && (
        <div className={styles.copyright}>
          Copyright © 2024 JP Pet Clinic All rights reserved.
        </div>
      )}
    </div>
  );
}


const LeftSide = ({ describe, focus, img }) => {
  const navigate = useNavigate()
  const device = useDevice();

  return (
    <div className={styles.leftSide} style={{ backgroundImage: img }}>
      {(device === deviceParams.pc || device === deviceParams.laptop) && (
        <div className={styles.logoContainer}>
          <div className={styles.logo} onClick={() => navigate("/")}></div>
        </div>
      )}
      <p className={styles.describe}>
        {describe} {focus ? <span>{focus}</span> : ""}
      </p>
    </div>
  );
}

const RightSide = ({ children }) => {
  return (
    <div className={styles.rightSide}>
      <div className={styles.formGroup}>
        { children }
      </div>
    </div>
  )
}

const TitleGroup = ({ title, point, point2, onClick }) => {
  return (
    <div className={styles.titleGroup}>
      <h2 className={styles.title}>{title}</h2>
      {point ?
        <div className={styles.pointGroup} onClick={onClick}>
          <p>{point}</p>
          <span>{point2}</span>
        </div>
        : ''}
    </div>
  )
}

const GoogleBtn = ({ title, onClick }) => {
  return (
    <>
      <button className={styles.googleBtn} onClick={onClick}><object data="/svg/google.svg" className={styles.googleLogo} aria-label="google"> </object>使用Google帳戶{title}</button>
      <p className={styles.instruction}>或使用Email帳號{title}</p>
    </>
  )
}

const FormGroup = ({ children, btnText, onSubmit}) => {
  return (
    <form action="post" className={styles.form}>
      {children}
      <button type="submit" className={styles.submitBtn} onClick={onSubmit}>
        <span className={styles.submitBtnText}>{btnText}</span>
        <span className={styles.submitBtnBg}></span>
      </button>
    </form>
  )
}

const InputGroup = ({ title, name, type, placeholder, autocomplete, value, onChange }) => {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={name} className={styles.inputLabel}>
        {title}
      </label>
      <div className={styles.inputWrapper}>
        <input
          type={type}
          name={name}
          id={name}
          placeholder={placeholder}
          className={styles.input}
          autoComplete={autocomplete}
          value={value}
          onChange={onChange}
          />
      </div>
    </div>
  );
}

const PasswordInput = ({ title, name, placeholder, autocomplete = "off", value, onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.inputGroup}>
      <label htmlFor={name} className={styles.inputLabel}>
        {title}
      </label>
      <div className={styles.inputWrapper}>
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          id={name}
          placeholder={placeholder}
          className={styles.input}
          autoComplete={autocomplete}
          value={value}
          onChange={onChange}
        />
        {showPassword && (
          <div className={styles.eyes} onClick={() => setShowPassword(false)}>
            <i className={`${styles.eyeIcon} fa-solid fa-eye-slash`}></i>
          </div>
        )}
        {!showPassword && (
          <div className={styles.eyes} onClick={() => setShowPassword(true)}>
            <i className={`${styles.eyeIcon} fa-solid fa-eye`}></i>
          </div>
        )}
      </div>
    </div>
  );
};

export {
  LoginContainer,
  LeftSide,
  RightSide,
  TitleGroup,
  GoogleBtn,
  FormGroup,
  InputGroup,
  PasswordInput,
};