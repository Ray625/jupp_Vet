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
  update,
  push,
  runTransaction,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { useState, useEffect, } from "react";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import useDevice from "../../hooks/useDevice";
import { deviceParams } from "../../utils/const";
import { ConfirmAlert, OneBtnAlert } from "../alert/alert";
import { PasswordInput } from "../login/login"
import { Paginator } from "../backstage/backstage";

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
  const { userInfo } = useAuth()
  const userName = userInfo ? `${userInfo.lastName || ""} ${userInfo.firstName || ""}` : "";

  return (
    <div className={styles.menu}>
      <div className={styles.title}>{`Hi, ${userName}`}</div>
      <div className={styles.list}>
        {list.map((item) => {
          return (
            <div
              className={`${styles.entry} ${
                pathname === `/user${item.index}` && styles.active
              }`}
              onClick={() => navigate("/user" + item.index)}
              key={item.index}
            >
              <div className={styles.item}>
                <div className={styles.footprint}></div>
                {item.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Wrapper = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  )
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
  const { userInfo, currentUser } = useAuth()
  const [ownerInfo, setOwnerInfo] = useState(
    {
      email: "",
      lastName: "",
      firstName: "",
      gender: "male",
      phone: "",
      location: "",
    }
  );
  const [userId, setUserId] = useState('')
  const [editing, setEditing] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertText, setAlertText] = useState('')
  const db = getDatabase()

  useEffect(() => {
    if (userInfo) {
      setOwnerInfo(userInfo)
    }
  }, [userInfo])

  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser.uid);
    }
  }, [currentUser])


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
    setOwnerInfo((prev) => ({
      ...prev,
      lastName: value,
    }));
  };

  const handleFirstNameChange = (value) => {
    setOwnerInfo((prev) => ({
      ...prev,
      firstName: value,
    }));
  };

  const handlePhoneChange = (value) => {
    setOwnerInfo((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  const handleGenderChange = (value) => {
    setOwnerInfo((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleUpdateInfo = async ({ userId, ownerInfo }) => {
    try {
      await update(ref(db, "users/" + userId), ownerInfo);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = ({ userId, ownerInfo }) => {
    if (!ownerInfo.lastName) {
      setAlertText("請填寫飼主姓氏");
      setAlertOpen(true)
      return
    }
    if (!ownerInfo.phone) {
      setAlertText("請填寫飼主手機");
      setAlertOpen(true);
      return
    }
    handleUpdateInfo({ userId, ownerInfo });
    setEditing(false);
  };

  return (
    <>
      {alertOpen && (
        <OneBtnAlert
          title={alertText}
          button="確認"
          handleClose={() => setAlertOpen(false)}
          handleConfirm={()=> setAlertOpen(false)}
        />
      )}
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
                info={`${ownerInfo.lastName || ""} ${ownerInfo.firstName || ""}`}
                mark={gender}
                className={styles.userInfoTable}
              />
              <InfoTableGroup
                title={"手機號碼"}
                info={ownerInfo.phone}
                className={styles.userInfoTable}
              />
            </div>
              <Button
                text="編輯飼主資料"
                onClick={() => {
                  setEditing(true);
                }}
              />
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
    </>
  );
};

const PetsInfo = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [editPet, setEditPet] = useState({});
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [userId, setUserId] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertText, setAlertText] = useState('')
  const device = useDevice()

  const {currentUser, petsInfo} = useAuth()
  const db = getDatabase();

  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser.uid);
    }
  }, [currentUser]);

  const handleDeletePetInfo = async ( petId ) => {
    const appointmentsRef = ref(db, "appointments");
    const queryAppointments = query(
      appointmentsRef,
      orderByChild("pet_id"),
      equalTo(petId)
    );

    const snap = await get(queryAppointments);
    if (snap.exists()) {
      const reserveList = snap.val()
      let hasAppointments = false

      Object.values(reserveList).forEach(data => {
        if (data.isCanceled) return
        const now = moment()
        const appointmentDate = data.date_key.slice(0, -5);

        if (
          now.isBefore(appointmentDate, "day") ||
          now.isSame(appointmentDate, "day")
        ) {
          hasAppointments = true;
        }
      })

      if (hasAppointments) {
        setAlertText(`尚有 ${editPet.petName} 的預約，請先取消預約再刪除寵物資訊`)
        setAlertOpen(true)
        return;
      }
    }

    await update(ref(db, "pets/" + petId), {
      isDeleted: true,
    });
    setEditPet({});
  }

  const handlePetNameChange = (value) => {
    setEditPet((prev) => ({
      ...prev,
      petName: value,
    }));
  };

  const handlePetGenderChange = (value) => {
    setEditPet((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handlePetSpeciesChange = (value) => {
    setEditPet((prev) => ({
      ...prev,
      species: value,
    }));
  };

  const handlePetBirthdayChange = (value) => {
    setEditPet((prev) => ({
      ...prev,
      birthday: value,
    }));
  };

  const handlePetBreedChange = (value) => {
    setEditPet((prev) => ({
      ...prev,
      breed: value,
    }));
  };

  const func = {
    handlePetNameChange,
    handlePetGenderChange,
    handlePetSpeciesChange,
    handlePetBirthdayChange,
    handlePetBreedChange,
  };

  const handleSavePet = async (petId, pet) => {
    if (pet.petName.length === 0) {
      setAlertText("請填寫寵物姓名");
      setAlertOpen(true)
      return
    }
    if (pet.gender.length === 0) {
      setAlertText("請選擇寵物性別");
      setAlertOpen(true);
      return
    }
    if (pet.species.length === 0) {
      setAlertText("請選擇寵物種類");
      setAlertOpen(true)
      return
    }
    if (pet.birthday.length === 0) {
      setAlertText("請填寫寵物生日");
      setAlertOpen(true)
      return
    }
    if (pet.breed.length === 0) {
      setAlertText("請選擇寵物品種");
      setAlertOpen(true)
      return
    }

    const petRef = ref(db, "pets/" + petId)
    try {
      update(petRef, pet);
    } catch (error) {
      console.log(error)
    }
    setEditing(false)
  }

  const handleAddNewPet = async (pet) => {
    if (pet.petName.length === 0) {
      setAlertText("請填寫寵物姓名");
      setAlertOpen(true);
      return;
    }
    if (pet.gender.length === 0) {
      setAlertText("請選擇寵物性別");
      setAlertOpen(true);
      return;
    }
    if (pet.species.length === 0) {
      setAlertText("請選擇寵物種類");
      setAlertOpen(true);
      return;
    }
    if (pet.birthday.length === 0) {
      setAlertText("請填寫寵物生日");
      setAlertOpen(true);
      return;
    }
    if (pet.breed.length === 0) {
      setAlertText("請選擇寵物品種");
      setAlertOpen(true);
      return;
    }

    try {
      const newPetKey = push(ref(db, "pets/"), pet).key;
      await update(ref(db, "pets/" + newPetKey), {
        owner_id: userId,
        petId: newPetKey,
        isDeleted: false
      });
    } catch (error) {
      console.log(error);
    }
    setAdding(false)
    setEditPet({})
  }

  return (
    <div className={styles.infoTable}>
      {confirmOpen && (
        <ConfirmAlert
          title={`確認刪除 ${editPet.petName} 的寵物資料？`}
          handleCancel={() => setConfirmOpen(false)}
          handleConfirm={() => {
            handleDeletePetInfo(editPet.petId);
            setConfirmOpen(false);
          }}
          handleClose={() => setConfirmOpen(false)}
        />
      )}
      {alertOpen && (
        <OneBtnAlert
          title={alertText}
          button="確認"
          handleClose={() => setAlertOpen(false)}
          handleConfirm={() => setAlertOpen(false)}
        />
      )}
      {!editing && !adding && (
        <>
          <h4 className={styles.tableTitle}>寵物資料</h4>
          <div className={`${styles.tableBody} ${styles.gap}`}>
            {petsInfo?.length === 0 && (
              <div className={styles.noData}>尚無資料</div>
            )}
            {petsInfo &&
              petsInfo.map((pet, index) => {
                if (pet.isDeleted) return;
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
                if (age <= 0) age = "未滿1";
                const key = index + 1;

                return (
                  <div
                    className={styles.tableField}
                    onClick={() => {
                      if (selectedIndex !== key) setSelectedIndex(key);
                      if (selectedIndex === key) setSelectedIndex(0);
                    }}
                    key={pet.petId}
                  >
                    <div
                      className={`${styles.petInfo} ${
                        selectedIndex === key ? styles.rightAngle : ""
                      }`}
                    >
                      <div className={styles.petInfoTitle}>寵物 {key}</div>
                      <div className={styles.petName}>{pet.petName}</div>
                      <img
                        src={speciesIcon}
                        alt="icon"
                        className={styles.icon}
                      />
                      {device !== deviceParams.mobile && (
                        <div className={styles.petInfoGroup}>
                          ({gender}・{age}歲・{pet.breed})
                        </div>
                      )}
                      <div
                        className={`${styles.openArrow} ${
                          selectedIndex === key && styles.invert
                        }`}
                      ></div>
                    </div>
                    {selectedIndex === key && (
                      <div className={styles.petInfoBody}>
                        {device === deviceParams.mobile && (
                          <div className={styles.petbodyInfo}>
                            {gender}・{age}歲・{pet.breed}
                          </div>
                        )}
                        <div className={styles.btnGroup}>
                          <button
                            className={styles.deleteBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmOpen(true);
                              setEditPet(pet);
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
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
          <Button
            text="新增寵物"
            onClick={() => {
              setAdding(true);
              setEditPet({
                petName: "",
                gender: "",
                breed: "",
                species: "",
                birthday: "",
              });
            }}
          />
        </>
      )}
      {editing && (
        <>
          <h4 className={styles.tableTitle}>編輯寵物資料</h4>
          <div className={styles.editPetForm}>
            <PetInfoForm petInfo={editPet} func={func} />
            <Button
              text="儲存"
              onClick={() => handleSavePet(editPet.petId, editPet)}
            />
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
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmConfig, setConfirmConfig] = useState({
    name: '',
    date: '',
    key: '',
    roomShift: '',
  })

  const { reserveInfo } = useAuth();
  const [records, setRecords] = useState(null)
  const [paginator, setPaginator] = useState({
    totalPage: null,
    currentPage: 1,
    inputValue: 1,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const totalPage = Math.ceil(reserveInfo.length / 5);
    setPaginator((prev) => {
      return {
        ...prev,
        totalPage: totalPage,
      };
    });
  }, [reserveInfo]);

  useEffect(() => {
    if (paginator.currentPage) {
      const startItems = 0 + (paginator.currentPage - 1) * 5;
      const endItems = 5 + (paginator.currentPage - 1) * 5;

      const currentPageData = reserveInfo.slice(startItems, endItems);

      setRecords(currentPageData);
    }
  }, [paginator.currentPage, reserveInfo]);

  const handleChangePage = (page) => {
    setPaginator((prev) => {
      return {
        ...prev,
        inputValue: page,
      };
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const pageNumber = Number(paginator.inputValue);

      if (pageNumber >= paginator.totalPage) {
        setPaginator((prev) => {
          return {
            ...prev,
            currentPage: paginator.totalPage,
            inputValue: paginator.totalPage,
          };
        });
        return;
      } else if (pageNumber <= 1) {
        setPaginator((prev) => {
          return {
            ...prev,
            currentPage: 1,
            inputValue: 1,
          };
        });
        return;
      } else {
        setPaginator((prev) => {
          return {
            ...prev,
            currentPage: pageNumber,
          };
        });
      }

      setSelectedIndex(0)
    }
  };

  const handleOnBlur = () => {
    if (paginator.inputValue === "") {
      setPaginator((prev) => ({
        ...prev,
        currentPage: 1,
        inputValue: 1,
      }));
    }
  };

  const handleTurnPage = (page) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setPaginator((prev) => {
      return {
        ...prev,
        currentPage: Number(prev.currentPage) + page,
        inputValue: Number(prev.currentPage) + page,
      };
    });
    setSelectedIndex(0)
  };

  const handleNextPage = () => {
    if (paginator.currentPage !== paginator.inputValue) {
      setPaginator((prev) => {
        return {
          ...prev,
          currentPage: Number(prev.currentPage),
          inputValue: Number(prev.currentPage),
        };
      });
    }

    if (paginator.currentPage < paginator.totalPage) {
      handleTurnPage(1);
    } else {
      return;
    }
  };

  const handlePrevPage = () => {
    if (paginator.currentPage !== paginator.inputValue) {
      setPaginator((prev) => {
        return {
          ...prev,
          currentPage: Number(prev.currentPage),
          inputValue: Number(prev.currentPage),
        };
      });
    }

    if (paginator.currentPage > 1) {
      handleTurnPage(-1);
    } else {
      return;
    }
  };


  const handleCancelReverse = (petName, date, key, roomShift) => {
    setConfirmConfig({
      name: petName,
      date: date,
      key: key,
      roomShift: roomShift,
    });
    setConfirmOpen(true)
  }

  const handleConfirmClose = () => {
    setConfirmConfig({
      name: "",
      date: "",
      key: "",
      roomShift: "",
    });
    setConfirmOpen(false)
  }


  const handleConfirm = async (e) => {
    e.stopPropagation()

    try {
      const db = getDatabase();
      const reserveRef = ref(db, `appointments/${confirmConfig.key}`);

      await update(reserveRef, {
        isCanceled: true,
      });

      const scheduleRef = ref(
        db,
        `schedule/${confirmConfig.date}/${confirmConfig.roomShift}`
      );

      await runTransaction(scheduleRef, (currentData) => {
        if (currentData) {
          if (currentData.currentAppointments > 0) {
            currentData.currentAppointments -= 1;
          }
        }
        return currentData;
      });
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {confirmOpen && (
        <ConfirmAlert
          title={`將取消 ${confirmConfig.name} 於 ${confirmConfig.date} 約診?`}
          handleCancel={handleConfirmClose}
          handleClose={handleConfirmClose}
          handleConfirm={handleConfirm}
        />
      )}
      <div className={styles.infoTable}>
        <h4 className={styles.tableTitle}>約診紀錄</h4>
        <div className={`${styles.tableBody} ${styles.gap}`}>
          {reserveInfo?.length === 0 && (
            <div className={styles.noData}>尚無資料</div>
          )}
          {records &&
            records.map((info, index) => {
              const date = moment(info.date_key.split("_")[0]).format("YYYY/MM/DD");
              const day = [
                "星期日",
                "星期一",
                "星期二",
                "星期三",
                "星期四",
                "星期五",
                "星期六",
                "星期日",
              ][moment(info.date_key.split("_")[0]).day()];
              const key = index + 1;
              const isPassed = moment().isAfter(
                info.date_key.split("_")[0],
                "day"
              );

              const shift = ["10:00 ~ 13:00", "14:00 ~ 18:00", "19:00 ~ 21:00"][
                info.date_key.slice(-1) - 1
              ];
              const roomShift = info.date_key.slice(-4);
              const doctor = info.doctor?.slice(0, -5);
              const petName = info.pet_name;
              const revserveNumber = info.number;
              const room = info.date_key.slice(-3, -2);

              return (
                <div key={info.key} className={styles.reserveInfoEntry}>
                  <div
                    className={`${styles.reserveInfo} ${
                      selectedIndex === key ? styles.rightAngle : ""
                    }`}
                    onClick={() => {
                      if (selectedIndex !== key) setSelectedIndex(key);
                      if (selectedIndex === key) setSelectedIndex(0);
                    }}
                  >
                    <div className={styles.petInfoTitle}>預約日期</div>
                    <div className={styles.infoDate}>{date}</div>
                    <div className={styles.revserveInfoDay}>{`(${day})`}</div>
                    <div
                      className={`${styles.openArrow} ${
                        selectedIndex === key && styles.invert
                      }`}
                    ></div>
                  </div>
                  {selectedIndex === key && (
                    <>
                      <div className={styles.reserveInfoGroup}>
                        <div className={styles.dividerBg}>
                          <div className={styles.divider}></div>
                        </div>
                        <div className={styles.infoRow}>
                          <div className={styles.infoTitle}>時段</div>
                          <p className={styles.info}>{shift}</p>
                        </div>
                        <div className={styles.infoRow}>
                          <div className={styles.infoTitle}>醫師</div>
                          <p className={styles.info}>{doctor}</p>
                        </div>
                        <div className={styles.infoRow}>
                          <div className={styles.infoTitle}>看診寵物</div>
                          <p className={styles.info}>{petName}</p>
                        </div>
                        <div className={styles.infoRow}>
                          <div className={styles.infoTitle}>約診號碼</div>
                          <p
                            className={styles.numInfo}
                          >{`${room} 診 ${revserveNumber} 號`}</p>
                        </div>
                      </div>
                      <div className={styles.reserveBtnGroup}>
                        <button
                          className={`${styles.deleteBtn} ${
                            isPassed ? styles.disable : ""
                          }`}
                          onClick={() =>
                            handleCancelReverse(
                              petName,
                              info.date,
                              info.key,
                              roomShift
                            )
                          }
                          disabled={isPassed}
                        >
                          {isPassed ? "日期已過，無法變更" : "取消預約"}
                          {!isPassed && (
                            <i className="fa-regular fa-trash-can"></i>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
        {reserveInfo.length !== 0 && (
          <Paginator
            currentPage={paginator.inputValue}
            totalPage={paginator.totalPage}
            handleChangePage={handleChangePage}
            handleKeyDown={handleKeyDown}
            handleOnBlur={handleOnBlur}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
          />
        )}
        <Button
          text="預約門診"
          onClick={() => {
            navigate("/booking");
          }}
        />
      </div>
    </>
  );
};

const Password = () => {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [alertOpen, setAlertOpen] = useState(false)
  const [alertText, setAlertText] = useState("")

  const { currentUser, changePassword } = useAuth();
  // 使用者登入方式
  const providerWay = currentUser?.providerData[0].providerId

  const handleChangePassword = ({oldPassword, newPassword, confirmPassword}) => {
    const isValidPassword = (password) => {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;
      return regex.test(password);
    };

    if (!isValidPassword(newPassword)) {
      setAlertText("請設定為8-12位英數混合之密碼");
      setAlertOpen(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlertText("新密碼與確認密碼不一致");
      setAlertOpen(true)
      return
    }

    changePassword({
      user: currentUser,
      oldPassword: oldPassword,
      newPassword: newPassword,
    });
  }

  return (
    <>
      {alertOpen && (
        <OneBtnAlert
          title={alertText}
          button="確認"
          handleClose={() => setAlertOpen(false)}
          handleConfirm={() => setAlertOpen(false)}
        />
      )}
      <div className={styles.infoTable}>
        <h4 className={styles.tableTitle}>變更密碼</h4>
        <div className={styles.tableBody}>
          {providerWay === "password" && (
            <>
              <div className={styles.form}>
                <PasswordInput
                  title="舊密碼"
                  name="password"
                  placeholder="請輸入舊密碼"
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                  }}
                />
                <PasswordInput
                  title="新密碼"
                  name="newPassword"
                  placeholder="請輸入8-12位英數混合之新密碼"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                />
                <PasswordInput
                  title="確認新密碼"
                  name="confirmPassword"
                  placeholder="請再次輸入新密碼"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
              </div>
              <Button
                text="變更"
                onClick={() =>
                  handleChangePassword({
                    oldPassword,
                    newPassword,
                    confirmPassword,
                  })
                }
              />
            </>
          )}
          {providerWay === "google.com" && (
            <>
              <div className={styles.googleHint}>
                <p>
                  您是以 Google 帳戶登入，因此未在本站設定密碼。
                  <br />
                  如需變更密碼，請至您的 Google 帳戶進行相關操作。
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export { Menu, Wrapper, UserInfo, PetsInfo, Record, Password };
