import { createContext, useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { getDatabase, set, ref, onValue, query, orderByChild, equalTo, off } from "firebase/database";
// eslint-disable-next-line
import { firebase } from "../utils/firebase";

const defaultAuthContext = {
  currentUser: null,
  userInfo: null,
  petsInfo: [],
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
  const [userInfo, setUserInfo] = useState(null);
  const [petsInfo, setPetsInfo] = useState([]);
  const { pathname } = useLocation();
  const navigate = useNavigate()
  const auth = getAuth();
  const db = getDatabase()
  const provider = new GoogleAuthProvider();

  // 讓畫面在第一次渲染時檢查是否已登入過會員，有則將會員資料存入state，並透過state改變使畫面渲染出使用者資訊。
  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setCurrentUser(user);
        } else {
          setCurrentUser(null);
          setUserInfo(null);
          setPetsInfo([]);
        }
      });

      return () => {
        unsubscribe(); // 取消身份驗證狀態改變監聽器
    };
  }, [auth])

  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.uid;

      const userRef = ref(db, "users/" + userId);
      onValue(userRef, (snap) => {
        if (snap.exists()) {
          setUserInfo(snap.val());
        } else {
          setUserInfo(null);
        }
      });

      const petRef = ref(db, "pets/");
      const petsQuery = query(
        petRef,
        orderByChild("owner_id"),
        equalTo(userId)
      );
      onValue(petsQuery, (snap) => {
        if (snap.exists()) {
          const userPetsInfo = snap.val();
          const petData = [];
          for (const [key, value] of Object.entries(userPetsInfo)) {
            petData.push({
              ...value,
              petId: key,
            });
          }
          setPetsInfo(petData);
        } else {
          setPetsInfo([]);
        }
      });

      return () => {
        off(userRef);
        off(petsQuery);
      };
    }
  }, [currentUser, db]);

  // 頁面切換時回到頂部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userInfo,
        petsInfo,
        isLoading,
        emailRegister: async ({ email, password, firstName, lastName }) => {
          try {
            setIsLoading(true);
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;
            await updateProfile(user, {
              displayName: `${lastName} ${firstName}`,
            });
            const user_id = user.uid;
            const userRef = ref(db, "users/" + user_id);
            await set(userRef, {
              firstName,
              lastName,
              email,
            });
            setCurrentUser(user);
            setIsLoading(false);
            navigate("/");
          } catch (error) {
            const errorCode = error.code;
            if (errorCode === "auth/email-already-in-use") {
              alert("此Email已註冊");
            }
            setIsLoading(false);
          }
        },
        googleLogin: async () => {
          try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            setCurrentUser(user);
            navigate("/");
          } catch (error) {
            // eslint-disable-next-line
            const errorCode = error.code;
          }
        },
        emailLogin: async ({ email, password }) => {
          try {
            setIsLoading(true);
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;
            setCurrentUser(user);
            setIsLoading(false);
            navigate("/");
          } catch (error) {
            const errorCode = error.code;
            if (errorCode === "auth/invalid-credential") {
              alert(
                "帳號或密碼錯誤，請再試一次，或按一下「忘記密碼」以重設密碼。"
              );
            }
            setIsLoading(false);
          }
        },
        logout: async () => {
          try {
            await signOut(auth);
            setCurrentUser(null);
            alert("已登出");
          } catch (error) {
            console.error(error);
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };