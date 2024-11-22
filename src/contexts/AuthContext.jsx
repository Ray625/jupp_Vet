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
import {
  getDatabase,
  set,
  ref,
  onValue,
  query,
  orderByChild,
  equalTo,
  off,
  get,
} from "firebase/database";
import { OneBtnAlert } from "../components/alert/alert"; 
// eslint-disable-next-line
import { firebase } from "../utils/firebase";

const defaultAuthContext = {
  currentUser: null,
  userInfo: null,
  petsInfo: [],
  reserveInfo: [],
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
  const [reserveInfo, setReserveInfo] = useState([])
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState("");
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

      // 擷取飼主資料
      const userRef = ref(db, "users/" + userId);
      onValue(userRef, (snap) => {
        if (snap.exists()) {
          setUserInfo(snap.val());
        } else {
          setUserInfo(null);
        }
      });

      // 擷取飼主擁有之寵物資料
      const petRef = ref(db, "pets");
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
            const pet = {
              ...value,
              petId: key,
            };

            if (!value.isDeleted) {
              petData.push(pet);
            }

          }
          setPetsInfo(petData);
        } else {
          setPetsInfo([]);
        }
      });

      // 擷取飼主約診紀錄
      const reserveRef = ref(db, "appointments")
      const reserveQuery = query(
        reserveRef,
        orderByChild("owner_id"),
        equalTo(userId),
      );
      onValue(reserveQuery, (snap) => {
        if (snap.exists()) {
          const userReserveInfo = snap.val();
          const reserveData = [];
          for (const [key, value] of Object.entries(userReserveInfo)) {
            const data = {
              ...value,
              key: key
            }
            if (!value.isCanceled) {
              reserveData.push(data)
            }
          }

          // 將資料按照預約日期排序
          reserveData.sort((a, b) => {
            return (
              new Date(b.date_key.split("_")[0]) -
              new Date(a.date_key.split("_")[0])
            );
          });
          setReserveInfo(reserveData);
        } else {
          setReserveInfo([]);
        }
      })

      return () => {
        off(userRef);
        off(petsQuery);
        off(reserveQuery);
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
        reserveInfo,
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
              firstName: firstName,
              lastName: lastName,
              email: email,
              createdAt: user.metadata.creationTime,
            });
            setCurrentUser(user);
            setIsLoading(false);
            navigate("/");
          } catch (error) {
            const errorCode = error.code;
            if (errorCode === "auth/email-already-in-use") {
              setAlertText("此Email已註冊");
              setAlertOpen(true);
            }
            setIsLoading(false);
          }
        },
        googleLogin: async () => {
          try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const user_id = user.uid;
            const userRef = ref(db, "users/" + user_id);
            const snap = await get(userRef);
            if (!snap.exists()) {
              await set(userRef, {
                firstName: user.displayName,
                email: user.email,
                createdAt: user.metadata.creationTime,
              });
            }

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
              setAlertText(
                "帳號或密碼錯誤，請再試一次，或按下「忘記密碼」以重設密碼。"
              );
              setAlertOpen(true);
            }
            setIsLoading(false);
          }
        },
        logout: async () => {
          try {
            await signOut(auth);
            setCurrentUser(null);
            setAlertText("已登出");
            setAlertOpen(true);
            navigate('/')
          } catch (error) {
            console.error(error);
          }
        },
      }}
    >
      {alertOpen && (
        <OneBtnAlert
          title={alertText}
          button={"確認"}
          handleClose={() => setAlertOpen(false)}
          handleConfirm={() => setAlertOpen(false)}
        />
      )}
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };