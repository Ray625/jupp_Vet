import { createContext, useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signOut, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
// eslint-disable-next-line
import firebase from "../utils/firebase";

const defaultAuthContext = {
  currentUser: null,
  emailRegister: null,
  googleLogin: null,
  emailLogin: null,
  logout: null,
  backTo: null,
  isLoading: false,
}

const AuthContext = createContext(defaultAuthContext);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();

  const navigate = useNavigate()
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  // 讓畫面在第一次渲染時檢查是否已登入過會員，有則將會員資料存入state，並透過state改變使畫面渲染出使用者資訊。
  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setCurrentUser(user);
        } else {
            setCurrentUser(null);
        }
      });

      return () => {
        unsubscribe(); // 取消身份驗證狀態改變監聽器
    };
// eslint-disable-next-line
  }, [])

  // 頁面切換時回到頂部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoading,
      emailRegister: async ({ email, password, firstName, lastName }) => {
        try {
          setIsLoading(true)
          const userCredential = await createUserWithEmailAndPassword(auth, email, password)
          const newUser = userCredential.user;
          await updateProfile(newUser, {displayName: `${lastName} ${firstName}`,})
          const user = auth.currentUser
          setCurrentUser(user)
          setIsLoading(false)
          navigate('/')
        } catch (error) {
          const errorCode = error.code;
          if(errorCode === 'auth/email-already-in-use') {
            alert('此Email已註冊')
          }
          setIsLoading(false)
        }
      },
      googleLogin: async () => {
        try {
          const result = await signInWithPopup(auth, provider)
          const user = result.user;
          setCurrentUser(user)
          navigate('/')
        } catch (error) {
          // eslint-disable-next-line
          const errorCode = error.code;
        }
      },
      emailLogin: async ({ email, password }) => {
        try {
          setIsLoading(true)
          const userCredential = await signInWithEmailAndPassword(auth, email, password)
          const user = userCredential.user;
          setCurrentUser(user)
          setIsLoading(false)
          navigate('/')
        } catch (error) {
          const errorCode = error.code;
          if (errorCode === 'auth/invalid-credential') {
            alert('帳號或密碼錯誤，請再試一次，或按一下「忘記密碼」以重設密碼。')
          }
          setIsLoading(false)
        }
      },
      logout: async () => {
        try {
          await signOut(auth)
          setCurrentUser(null)
          alert('已登出')
        } catch (error) {
          console.error(error)
        }
      },
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };