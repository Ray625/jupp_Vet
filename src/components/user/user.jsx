import styles from "./user.module.scss";
import { useNavigate, useLocation } from "react-router-dom";
import {
  InfoTableGroup,
  NameInput,
  PhoneInput,
  PetInfoForm,
} from "../booking/booking";
import {
  getDatabase,
  ref,
  get,
  onValue,
  query,
  orderByChild,
  equalTo,
  update,
  remove,
  off,
  push
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import moment from "moment";

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
    index: "/password",
  },
];

const Menu = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user.uid;
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userRef = ref(db, "users/" + userId);
    onValue(userRef, (snap) => {
      if (snap.exists()) {
        const userInfo = snap.val();
        const { lastName, firstName } = userInfo;
        const fullName = `${lastName} ${firstName}`;
        setUserName(fullName);
      } else {
        return;
      }
    });

    return () => {
      off(userRef);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.menu}>
      <div className={styles.title}>{`Hi, ${userName}`}</div>
      <ul className={styles.list}>
        {list.map((item) => {
          return (
            <>
              <li
                className={`${styles.entry} ${
                  pathname === `/user${item.index}` && styles.active
                }`}
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
  return <div className={styles.wrapper}>{children}</div>;
};

const Button = ({ onClick, text }) => {
  const handleClick = (e) => {
    e.preventDefault();
    onClick();
  };

  return (
    <button className={styles.btn} onClick={handleClick}>
      {text}
    </button>
  );
};

const UserInfo = () => {
  const [ownerInfo, setOwnerInfo] = useState({
    email: "",
    lastName: "",
    firstName: "",
    gender: "male",
    phone: "",
    location: "",
  });
  const [editing, setEditing] = useState(false);

  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user.uid;

  useEffect(() => {
    async function getUserInfo() {
      try {
        const snap = await get(ref(db, "users/" + userId));
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
  }, [editing]);

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

  const handleUpdateInfo = async ({ userId, ownerInfo }) => {
    try {
      await update(ref(db, "users/" + userId), ownerInfo);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = ({ userId, ownerInfo }) => {
    if (!ownerInfo.lastName) return alert("請填寫飼主姓氏");
    if (!ownerInfo.phone) return alert("請填寫飼主手機");
    handleUpdateInfo({ userId, ownerInfo });
    setEditing(false);
  };

  return (
    <div className={styles.infoTable}>
      {!editing && (
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
              info={`${ownerInfo.lastName} ${ownerInfo.firstName}`}
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
                setEditing(true);
              }}
            />
          </div>
        </>
      )}
      {editing && (
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
              onClick={() => handleSave({ userId, ownerInfo })}
            />
          </div>
        </>
      )}
    </div>
  );
};

const PetsInfo = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [petsInfo, setPetsInfo] = useState([]);
  const [editPet, setEditPet] = useState({});
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);

  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user.uid;

  useEffect(() => {
    const petRef = ref(db, "pets/")
    const petsQuery = query(petRef, orderByChild("owner_id"), equalTo(userId))

    onValue(petsQuery, snap => {
      if (snap.exists()) {
        const userPetsInfo = snap.val();
        const petData = [];
        for (const [key, value] of Object.entries(userPetsInfo)) {
          petData.push({
            ...value,
            id: key,
          });
        }
        setPetsInfo(petData);
      } else {
        setPetsInfo([]);
      }
    })

    return () => {
      off(petsQuery);
    }
    // eslint-disable-next-line
  }, [])

  const handleDeletePetInfo = ( petId, petName ) => {
    const resulf = confirm(`刪除 ${petName} 的寵物資料?`);
    if (resulf) remove(ref(db, "pets/" + petId));
    else return
  }

  const handlePetNameChange = (value) => {
    setEditPet({
      ...editPet,
      petName: value,
    });
  };

  const handlePetGenderChange = (value) => {
    setEditPet({
      ...editPet,
      gender: value,
    });
  };

  const handlePetSpeciesChange = (value) => {
    setEditPet({
      ...editPet,
      species: value,
    });
  };

  const handlePetBirthdayChange = (value) => {
    setEditPet({
      ...editPet,
      birthday: value,
    });
  };

  const handlePetBreedChange = (value) => {
    setEditPet({
      ...editPet,
      breed: value,
    });
  };

  const func = {
    handlePetNameChange,
    handlePetGenderChange,
    handlePetSpeciesChange,
    handlePetBirthdayChange,
    handlePetBreedChange,
  };

  const handleSavePet = async (petId) => {
    const petRef = ref(db, "pets/" + petId)
    try {
      update(petRef, editPet)
    } catch (error) {
      console.log(error)
    }
    setEditing(false)
  }

  const handleAddNewPet = async (pet) => {
    try {
      const newPetKey = push(ref(db, "pets/"), pet).key;
      await update(ref(db, "pets/" + newPetKey), {
        owner_id: userId,
      });
    } catch (error) {
      console.log(error);
    }
    setAdding(false)
    setEditPet({})
  }

  return (
    <div className={styles.infoTable}>
      {!editing && !adding && (
        <>
          <h4 className={styles.tableTitle}>寵物資料</h4>
          <div className={`${styles.tableBody} ${styles.gap}`}>
            {petsInfo.length === 0 && (
              <div className={styles.noData}>尚無資料</div>
            )}
            {petsInfo.map((pet, index) => {
              let speciesIcon = "";
              switch (pet.species) {
                case "feline":
                  speciesIcon = "/svg/booking_cat.svg";
                  break;
                default:
                  speciesIcon = "/svg/booking_dog.svg";
              }
              let gender = "";
              switch (pet.gender) {
                case "female":
                  gender = "母";
                  break;
                default:
                  gender = "公";
              }
              let age = moment().format("YYYY") - pet.birthday;
              if (age <= 0) age = '未滿1'
              const key = index + 1;

              return (
                <>
                  <div
                    className={styles.tableField}
                    onClick={() => {
                      if (selectedIndex !== key) setSelectedIndex(key);
                      if (selectedIndex === key) setSelectedIndex(0);
                    }}
                  >
                    <div
                      className={`${styles.petInfo} ${
                        selectedIndex === index + 1 && styles.rightAngle
                      }`}
                    >
                      <div className={styles.petInfoTitle}>寵物 {key}</div>
                      <div className={styles.petName}>{pet.petName}</div>
                      <img
                        src={speciesIcon}
                        alt="icon"
                        className={styles.icon}
                      />
                      <div className={styles.petInfoGroup}>
                        ({gender}・{age}歲・{pet.breed})
                      </div>
                      <div
                        className={`${styles.openArrow} ${
                          selectedIndex === key && styles.invert
                        }`}
                      ></div>
                    </div>
                    {selectedIndex === key && (
                      <div className={styles.btnGroup}>
                        <button
                          className={styles.deleteBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePetInfo(pet.id, pet.petName);
                          }}
                        >
                          刪除
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                        <button
                          className={styles.editBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditing(true);
                            setEditPet(pet);
                          }}
                        >
                          編輯
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              );
            })}
          </div>
          <Button
            text="新增寵物"
            onClick={() => {
              setAdding(true);
              setEditPet({});
            }}
          />
        </>
      )}
      {editing && (
        <>
          <h4 className={styles.tableTitle}>編輯寵物資料</h4>
          <div className={styles.editPetForm}>
            <PetInfoForm petInfo={editPet} func={func} />
            <Button text="儲存" onClick={() => handleSavePet(editPet.id)} />
          </div>
        </>
      )}
      {adding && (
        <>
          <h4 className={styles.tableTitle}>新增寵物資料</h4>
          <div className={styles.editPetForm}>
            <PetInfoForm petInfo={editPet} func={func} />
            <Button text="新增" onClick={() => handleAddNewPet(editPet)} />
          </div>
        </>
      )}
    </div>
  );
};

const Record = () => {
  return <div>約診紀錄</div>;
};

const Password = () => {
  return <div>修改密碼</div>;
};

export { Menu, Wrapper, UserInfo, PetsInfo, Record, Password };
