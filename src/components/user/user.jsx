import styles from "./user.module.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { InfoTableGroup, NameInput, PhoneInput } from "../booking/booking";
import { getDatabase, ref, get, query, orderByChild, equalTo, update, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";


const list = [
  {
    title: "飼主資料",
    index: "",
  },
  {
    title: "寵物資料",
    index: "/pets",
  },
  {
    title: "預約紀錄",
    index: "/records",
  },
  {
    title: "變更密碼",
    index: "/password"
  }
];

const Menu = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className={styles.menu}>
      <div className={styles.title}>Hi, Name</div>
      <ul className={styles.list}>
        {list.map((item) => {
          return (
            <>
              <li
                className={`${styles.entry} ${pathname === `/user${item.index}` && styles.active}`}
                onClick={() => navigate("/user" + item.index)}
              >
                <p className={styles.item}>
                  <div className={styles.footprint}></div>
                  {item.title}
                </p>
              </li>
            </>
          );
        })}
      </ul>
    </div>
  );
};

const Wrapper = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  )
}

const Button = ({ onClick, text }) => {
  const handleClick = (e) => {
    e.preventDefault()
    onClick()
  }

  return (
    <button className={styles.btn} onClick={handleClick}>
      {text}
    </button>
  );
}

const UserInfo = () => {
  const [ownerInfo, setOwnerInfo] = useState({ email: '', lastName: '', firstName: '', gender: 'male', phone: '', location: '' })
  const [edit, setEdit] = useState(false)

  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;
  const user_id = user.uid;

  useEffect(() => {
    async function getUserInfo() {
      try {
        const snap = await get(ref(db, "users/" + user_id));
        if (snap.exists()) {
          const userInfo = snap.val();
          const { lastName, firstName, gender, phone } = userInfo;
          const email = user.email;

          const updatedInfo = { ...ownerInfo };
          if (lastName) updatedInfo.lastName = lastName;
          if (firstName) updatedInfo.firstName = firstName;
          if (gender) updatedInfo.gender = gender;
          if (phone) updatedInfo.phone = phone;
          if (email) updatedInfo.email = email;

          setOwnerInfo(updatedInfo);
        } else {
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }

    getUserInfo();
    // eslint-disable-next-line
  }, [edit]);

  let gender = "";
  switch (ownerInfo.gender) {
    case "male":
      gender = "(先生)";
      break;
    case "female":
      gender = "(小姐)";
      break;
    default:
      gender = "";
  }

  const handleLastNameChange = (value) => {
    setOwnerInfo({
      ...ownerInfo,
      lastName: value,
    });
  };

  const handleFirstNameChange = (value) => {
    setOwnerInfo({
      ...ownerInfo,
      firstName: value,
    });
  };

  const handlePhoneChange = (value) => {
    setOwnerInfo({
      ...ownerInfo,
      phone: value,
    });
  };

  const handleGenderChange = (value) => {
    setOwnerInfo({
      ...ownerInfo,
      gender: value,
    });
  };

  const handleUpdateInfo = async ({ user_id, ownerInfo }) => {
    try {
      await update(ref(db, "users/" + user_id), ownerInfo);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = ({ user_id, ownerInfo }) => {
    if (!ownerInfo.lastName) return alert("請填寫飼主姓氏");
    if (!ownerInfo.phone) return alert("請填寫飼主手機");
    handleUpdateInfo({ user_id, ownerInfo });
    setEdit(false);
  };


  return (
    <div className={styles.userInfo}>
      {!edit && (
        <>
          <h4 className={styles.tableTitle}>飼主資料</h4>
          <div className={styles.tableBody}>
            <InfoTableGroup
              title={"Email"}
              info={ownerInfo.email}
              className={styles.userInfoTable}
            />
            <InfoTableGroup
              title={"姓名"}
              info={ownerInfo.lastName + ownerInfo.firstName}
              mark={gender}
              className={styles.userInfoTable}
            />
            <InfoTableGroup
              title={"手機號碼"}
              info={ownerInfo.phone}
              className={styles.userInfoTable}
            />
            {ownerInfo.location && (
              <InfoTableGroup
                title={"現居地區"}
                info={"location"}
                className={styles.userInfoTable}
              />
            )}
            <Button
              text="編輯飼主資料"
              onClick={() => {
                setEdit(true);
              }}
            />
          </div>
        </>
      )}
      {edit && (
        <>
          <h4 className={styles.tableTitle}>編輯飼主資料</h4>
          <div className={styles.tableBody}>
            <div className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.inputTitle}>
                  Email (會員帳號不得修改)
                </label>
                <input
                  name="email"
                  id="email"
                  type="email"
                  className={styles.emailInput}
                  value={ownerInfo.email}
                  disabled
                />
              </div>
              <NameInput
                lastName={ownerInfo.lastName}
                firstName={ownerInfo.firstName}
                gender={ownerInfo.gender}
                handleLastNameChange={handleLastNameChange}
                handleFirstNameChange={handleFirstNameChange}
                handleGenderChange={handleGenderChange}
              />
              <PhoneInput
                phone={ownerInfo.phone}
                handlePhoneChange={handlePhoneChange}
              />
            </div>
            <Button
              text="儲存"
              onClick={() => handleSave({ user_id, ownerInfo })}
            />
          </div>
        </>
      )}
    </div>
  );
}

const PetsInfo = () => {
  return (
    <div>
      寵物資料
    </div>
  )
}

const Record = () => {
  return (
    <div>
      約診紀錄
    </div>
  )
}

const Password = () => {
  return <div>修改密碼</div>;
};


export { Menu, Wrapper, UserInfo, PetsInfo, Record, Password };