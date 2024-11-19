import { useNavigate } from 'react-router-dom';
import styles from './booking.module.scss';
import { timeList } from '../../utils/const';
import moment from 'moment';
import { getDatabase, ref, get, query, orderByChild, equalTo, update, push, runTransaction,limitToLast } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from 'react';
import useAuth from "../../hooks/useAuth";
import { OneBtnAlert } from "../alert/alert";


const Container = ({ children, title, subitle, titleBgClassName, containerBgClassName  }) => {
  return (
    <div className={`${styles.container} ${containerBgClassName}`}>
      <div className={styles.wrapper}>
        <div className={styles.titleGroup}>
          <div
            className={`${styles.titleBackground} ${titleBgClassName} `}
          ></div>
          <img
            src="/svg/home_footprint_white.svg"
            alt="icon"
            className={styles.footprint}
          />
          <h2 className={styles.title}>{title}</h2>
          <h3 className={styles.subtitle}>{subitle}</h3>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

const StepGroup = ({step}) => {
  return (
    <>
      {(step === 1 || step === 2 || step === 3) &&
        <div className={styles.stepGroup}>
          <div className={step === 1 ? `${styles.step1} ${styles.active}`: `${styles.step1} ${styles.done}`}>
            <div className={styles.stepNum}>1</div>
            <div className={styles.stepName}>選擇門診</div>
          </div>
            <div className={
              step === 1
                ? styles.step2
                : step === 2
                ? `${styles.step2} ${styles.active}`
                : step === 3
                ? `${styles.step2} ${styles.done}`
                : styles.step2
            }>
            <div className={styles.stepNum}>2</div>
            <div className={styles.stepName}>輸入預約資料</div>
          </div>
          <div className={step === 3 ? `${styles.step3} ${styles.active}`: styles.step3}>
            <div className={styles.stepNum}>3</div>
            <div className={styles.stepName}>確認預約資料</div>
          </div>
        </div>
      }
      {step === 4 &&
        <div className={styles.stepGroup}>
          <div className={styles.step4}>
            <div className={styles.stepDone}></div>
            <div className={styles.stepDoneName}>預約成功</div>
          </div>
        </div>
      }
    </>
  )
}

const WeekSelection = ({ weeks, onChange, selectedWeekIndex}) => {

  return (
    <select name="date" id="date" className={styles.selection} onChange={onChange} value={selectedWeekIndex}>
      {weeks.map((week, index)=>{return <option value={index} key={index}>{week}</option>})}
    </select>
  )
}

const DaySelection = ({ weeks, selectedWeekIndex, reserveInfo, handleInfoChange }) => {
  const selectedWeek = weeks[selectedWeekIndex];
  const [startDate, endDate] = selectedWeek.split(' ~ ');
  const startDateObj = moment(startDate, "YYYY/MM/DD");
  const endDateObj = moment(endDate, "YYYY/MM/DD");
  const days = [];
  for (let date = startDateObj; date <= endDateObj; date.add('1', 'day')) {
    const formattedDate = date.format('YYYY/MM/DD');
    const day = ['日', '一', '二', '三', '四', '五', '六'][date.day()]
    days.push(`${formattedDate} (${day})`);
  }

  const compare = (value) => {
    if (reserveInfo.date === value) {
      return true
    } else {
      return false
    }
  }

  return (
    <div className={styles.btnGroup}>
      {days.map((day) => {
        return (
          <div key={day}>
            {compare(day) && <input type="radio" name="date" id={day} value={day} onChange={(e) => handleInfoChange(e.target.value)} checked />}
            {!compare(day) && <input type="radio" name="date" id={day} value={day} onChange={(e) => handleInfoChange(e.target.value)} />}
            <label htmlFor={day} className={styles.dateBtn}>
              {day.slice(5)}
            </label>
          </div>
        );})}
    </div>
  )
}

const TimeBtnGroup = ({ handleInfoChange, reserveInfo }) => {
  const compare = (value) => {
    if (reserveInfo.time === value) {
      return true
    } else {
      return false
    }
  }

  const timeData = [
    {
      title: "10:00 ~ 13:00",
      value: "shift1",
    },
    {
      title: "14:00 ~ 18:00",
      value: "shift2",
    },
    {
      title: "19:00 ~ 21:00",
      value: "shift3",
    },
  ];

  return (
    <div className={styles.btnGroup}>
      {timeData.map((data) => {
        return (
          <div key={data.value}>
            {compare(data.value) && <input type="radio" name='time' id={data.value} value={data.value} onChange={e => handleInfoChange(e.target.value)} checked />}
            {!compare(data.value) && <input type="radio" name='time' id={data.value} value={data.value} onChange={e => handleInfoChange(e.target.value)} />}
            <label htmlFor={data.value} className={styles.timeBtn}>{data.title}</label>
          </div>
        )
      })}
    </div>
  )
}

const DoctorBtnGroup = ({ datas ,handleInfoChange, reserveInfo }) => {
  const compare = (value) => {
    if (reserveInfo.doctor === value) {
      return true
    } else {
      return false
    }
  }

  return (
    <div className={styles.btnGroup}>
      {datas.map((data) => {
        return (
          <div key={data.value}>
            {compare(data.title) && (
              <input
                type="radio"
                name="doctor"
                id={data.value}
                value={data.title}
                data-time_shift={data.value}
                onChange={(e) =>
                  handleInfoChange(e.target.value, e.target.dataset.time_shift)
                }
                checked
              />
            )}
            {!compare(data.title) && (
              <input
                type="radio"
                name="doctor"
                id={data.value}
                value={data.title}
                data-time_shift={data.value}
                data-last={data.last}
                onChange={(e) =>
                  handleInfoChange(
                    e.target.value,
                    e.target.dataset.time_shift,
                    e.target.dataset.last
                  )
                }
                disabled={data.last <= 0}
              />
            )}
            <label
              htmlFor={data.value}
              className={`${styles.doctorBtn} ${
                data.last <= 0 ? styles.disable : ""
              }`}
            >
              {data.title}
              {0 < data.last && data.last <= 3 && (
                <span className={styles.disableGray}>
                  &nbsp;{`(剩餘${data.last}位)`}
                </span>
              )}
              {data.last <= 0 && <span>&nbsp;{"(已額滿)"}</span>}
            </label>
          </div>
        );
      })}
    </div>
  )
}

const NextBtn = ({ title, onClick }) => {
  return (
    <button
      type="submit"
      className={styles.nextBtn}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <span className={styles.nextBtnText}>{title}</span>
      <span className={styles.nextBtnBg}></span>
    </button>
  );
}

const PrevBtn = ({ title, onClick }) => {
  return (
    <button type="submit" className={styles.prevBtn} onClick={(e) => {
      e.preventDefault()
      onClick()
    }}>
      {title}
    </button>
  )
}

const FormStep1 = ({ handleNextStep, reserveInfo, reserveData, setReserveInfo, selectedWeekIndex, setSelectedWeekIndex }) => {
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    button: "確認",
    handleClose: () => setAlertOpen(false),
    handleConfirm: () => setAlertOpen(false),
  });
  const { currentUser } = useAuth()

  const handleWeekChange = (event) => {
    setSelectedWeekIndex(event.target.value)
    setReserveInfo({ date: "", time: "", doctor: "", key: "", last: null });
  }

  const handleDateChange = (value) => {
    setReserveInfo({
      ...reserveInfo,
      date: value,
      time: "",
      doctor: "",
      key: "",
      last: null,
    });
  }

  const handleTimeChange = (value) => {
    setReserveInfo({
      ...reserveInfo,
      time: value,
      doctor: "",
      key: "",
      last: null,
    });
  }

  const handleSubmit = () => {
    if (reserveInfo.date.length === 0) {
      setAlertConfig((prev) => {
        return {
          ...prev,
          title: "請選擇預約日期",
          button: "確認",
          handleConfirm: () => setAlertOpen(false),
        };
      });
      setAlertOpen(true)
      return
    } else if (reserveInfo.time.length === 0) {
      setAlertConfig((prev) => {
        return {
          ...prev,
          title: "請選擇預約時段",
          button: "確認",
          handleConfirm: () => setAlertOpen(false),
        };
      });
      setAlertOpen(true);
      return
    } else if (reserveInfo.doctor.length === 0) {
      setAlertConfig((prev) => {
        return {
          ...prev,
          title: "請選擇醫師",
          button: "確認",
          handleConfirm: () => setAlertOpen(false),
        };
      });
      setAlertOpen(true);
      return
    }

    if (currentUser === null) {
      setAlertConfig((prev) => {
        return {
          ...prev,
          title: "線上預約請先登入會員",
          button: "登入",
          handleConfirm: () => {
            setAlertOpen(false);
            const loginWindow = window.open("/login", "_blank"); // 打開新的視窗至登入頁面
            if (loginWindow) {
              loginWindow.focus(); // 確保新視窗獲得焦點
            }
          },
        };
      });
      setAlertOpen(true);
      return;
    }

    handleNextStep()
  }

  const handleDoctorChange = (value, timeShift, last) => {
    setReserveInfo({
      ...reserveInfo,
      doctor: value,
      key: timeShift,
      last: last,
    });
  }

  // 將時間週期設為今日開始計算，為期四週
  const weeks = [];
  const today = moment();
  const endDay = moment().add("6", "day");

  for (let i = 0; i < 4; i++) {
    let week =
      today.clone().add(i, "weeks").format("YYYY/MM/DD") +
      " ~ " +
      endDay.clone().add(i, "weeks").format("YYYY/MM/DD");
    weeks.push(week);
  }


  if (moment(endDay.clone().add(3, "weeks").format("YYYY-MM-DD")).isBefore(today.clone().add(1, "months").format("YYYY-MM-DD"))) {
    let week =
      today.clone().add(4, "weeks").format("YYYY/MM/DD") +
      " ~ " +
      today.clone().add(1, "months").format("YYYY-MM-DD")
    weeks.push(week);
  }

  const doctorData = []
  Object.entries(reserveData).forEach(([key, value]) => {
    const data = {
      title: `${value.name} 醫師 (${value.room})`,
      value: key,
      last: value.maxAppointments - value.currentAppointments,
    };
    doctorData.push(data);
  })

  return (
    <>
      {alertOpen && (
        <OneBtnAlert
          title={alertConfig.title}
          button={alertConfig.button}
          handleClose={alertConfig.handleClose}
          handleConfirm={alertConfig.handleConfirm}
        />
      )}
      <div className={styles.formContainer}>
        <form action="post" className={styles.form}>
          <h3 className={styles.formTitle}>請選擇日期</h3>
          <p className={styles.describe}>(僅能預約一個月內之日期)</p>
          <WeekSelection
            weeks={weeks}
            onChange={handleWeekChange}
            selectedWeekIndex={selectedWeekIndex}
          />
          <DaySelection
            selectedWeekIndex={selectedWeekIndex}
            weeks={weeks}
            reserveInfo={reserveInfo}
            handleInfoChange={handleDateChange}
          />
          {reserveInfo?.date.length !== 0 && (
            <>
              <h3 className={styles.formTitle}>請選擇時段</h3>
              <TimeBtnGroup
                handleInfoChange={handleTimeChange}
                reserveInfo={reserveInfo}
              />
            </>
          )}
          {reserveInfo?.time.length !== 0 && doctorData.length !== 0 && (
            <>
              <h3 className={styles.formTitle}>請選擇門診</h3>
              <DoctorBtnGroup
                datas={doctorData}
                handleInfoChange={handleDoctorChange}
                reserveInfo={reserveInfo}
              />
            </>
          )}
          {reserveInfo?.time.length !== 0 && doctorData.length === 0 && (
            <>
              <div className={styles.noDuty}>該時段無看診</div>
            </>
          )}
        </form>
        <div className={styles.submitBtnGroup}>
          <NextBtn title={"下一步"} onClick={handleSubmit} />
        </div>
      </div>
    </>
  );
}

const NameInput = ({lastName, firstName, gender, handleLastNameChange, handleFirstNameChange, handleGenderChange}) => {
  return (
    <div className={styles.nameGroup}>
      <div className={styles.inputGroup}>
        <label htmlFor="lastName" className={styles.inputTitle}>
          姓氏 *
        </label>
        <input
          name="lastName"
          id="lastName"
          type="lastName"
          autoComplete="family-name"
          className={styles.nameInput}
          value={lastName}
          onChange={(e) => handleLastNameChange(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="firstName" className={styles.inputTitle}>
          名字
        </label>
        <input
          name="firstName"
          id="firstName"
          type="firstName"
          autoComplete="given-name"
          className={styles.nameInput}
          value={firstName}
          onChange={(e) => handleFirstNameChange(e.target.value)}
        />
      </div>
      <div className={styles.gender}>
        <input
          type="radio"
          name="gender"
          id="male"
          value={"male"}
          className={styles.genderInput}
          onChange={(e) => handleGenderChange(e.target.value)}
          checked={gender === "male"}
        />
        <label htmlFor="male" className={styles.genderLabel}>
          先生
        </label>
        <input
          type="radio"
          name="gender"
          id="female"
          value={"female"}
          className={styles.genderInput}
          onChange={(e) => handleGenderChange(e.target.value)}
          checked={gender === "female"}
        />
        <label htmlFor="female" className={styles.genderLabel}>
          小姐
        </label>
      </div>
    </div>
  );
}

const PhoneInput = ({phone, handlePhoneChange}) => {
  return (
    <div className={styles.phone}>
      <label htmlFor="phone" className={styles.inputTitle}>
        手機號碼 *
      </label>
      <input
        name="phone"
        id="phone"
        type="tel"
        autoComplete="tel"
        placeholder="請輸入您的手機號碼"
        maxLength={"13"}
        className={styles.phoneInput}
        value={phone}
        onChange={(e) => handlePhoneChange(e.target.value)}
      />
    </div>
  );
}

const PetInfoForm = ({ petInfo, func }) => {
  const {
    handlePetNameChange,
    handlePetGenderChange,
    handlePetSpeciesChange,
    handlePetBirthdayChange,
    handlePetBreedChange,
  } = func;

  return (
    <div className={styles.infoBody}>
      <div className={styles.nameGroup}>
        <div className={styles.inputGroup}>
          <label htmlFor="petName" className={styles.inputTitle}>
            寵物名
          </label>
          <input
            name="petName"
            id="petName"
            type="text"
            autoComplete="auto"
            className={styles.petNameInput}
            value={petInfo.petName}
            onChange={(e) => handlePetNameChange(e.target.value)}
          />
        </div>
        <div className={`${styles.inputGroup} ${styles.petGenderInput}`}>
          <label htmlFor="petGender" className={styles.inputTitle}>
            性別
          </label>
          <select
            name="petGender"
            id="petGender"
            className={styles.selection}
            onChange={(e) => handlePetGenderChange(e.target.value)}
            value={petInfo.gender}
          >
            <option value="">請選擇</option>
            <option value="male">公</option>
            <option value="female">母</option>
          </select>
        </div>
        <div className={styles.species}>
          <input
            type="radio"
            name="species"
            id="canine"
            value={"canine"}
            className={styles.speciesInput}
            onChange={(e) => handlePetSpeciesChange(e.target.value)}
            checked={petInfo.species === "canine"}
          />
          <label htmlFor="canine" className={styles.speciesLabel}>
            <img
              src="/svg/booking_dog.svg"
              alt="icon"
              className={styles.petInfoIcon}
            />
            狗
          </label>
          <input
            type="radio"
            name="species"
            id="feline"
            value={"feline"}
            className={styles.speciesInput}
            onChange={(e) => handlePetSpeciesChange(e.target.value)}
            checked={petInfo.species === "feline"}
          />
          <label htmlFor="feline" className={styles.speciesLabel}>
            <img
              src="/svg/booking_cat.svg"
              alt="icon"
              className={styles.petInfoIcon}
            />
            貓
          </label>
        </div>
      </div>
      <div className={styles.infoBdBreed}>
        <div className={styles.inputGroup}>
          <label htmlFor="bd" className={styles.inputTitle}>
            出生年份
          </label>
          <input
            name="bd"
            id="bd"
            type="number"
            placeholder="西元年"
            autoComplete="auto"
            className={styles.bdayInput}
            onChange={(e) => handlePetBirthdayChange(e.target.value)}
            value={petInfo.birthday}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="birth" className={styles.inputTitle}>
            品種
          </label>
          <input
            name="breed"
            id="breed"
            type="text"
            autoComplete="auto"
            className={styles.bdayInput}
            onChange={(e) => handlePetBreedChange(e.target.value)}
            value={petInfo.breed}
          />
        </div>
      </div>
    </div>
  );
};

const FormStep2 = ({
  handlePrevStep,
  handleNextStep,
  reserveInfo,
  ownerInfo,
  setOwnerInfo,
  newPetInfo,
  setNewPetInfo,
  selectedPets,
  setSelectedPets,
  haveNewPet,
  setHaveNewPet,
}) => {
  const [originalPetInfo, setOriginalPetInfo] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState("");

  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user.uid;

  // 在渲染頁面後抓取user在資料庫的名字，自動填入表單
  useEffect(() => {
    async function getUserInfo() {
      try {
        const snap = await get(ref(db, "users/" + userId));
        if (snap.exists()) {
          const userInfo = snap.val();
          const { lastName, firstName, gender, phone } = userInfo;

          const updatedInfo = { ...ownerInfo };
          if (lastName) updatedInfo.lastName = lastName;
          if (firstName) updatedInfo.firstName = firstName;
          if (gender) updatedInfo.gender = gender;
          if (phone) updatedInfo.phone = phone;
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
  }, []);

  // 在渲染頁面後抓取user在資料庫內原有寵物資料，放入選項供勾選
  useEffect(() => {
    async function getUserPetInfo() {
      try {
        const snap = await get(
          query(ref(db, "pets/"), orderByChild("owner_id"), equalTo(userId))
        );
        if (snap.exists()) {
          const userPetInfo = snap.val();
          const petData = [];
          for (const [key, value] of Object.entries(userPetInfo)) {
            const pet = {
              ...value,
              id: key,
            }

            if (!value.isDeleted) {
              petData.push(pet)
            }
          }
          if (petData.length === 0) {
            setHaveNewPet(true);
          } else {
            setOriginalPetInfo(petData);
          }
        } else {
          setHaveNewPet(true);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getUserPetInfo();
    // eslint-disable-next-line
  }, []);

  const handleAddNewPet = () => {
    if (selectedPets.length >= 3) {
      setAlertText("一次最多預約3隻寵物");
      setAlertOpen(true);
      return;
    } else if (selectedPets.length >= reserveInfo.last) {
      setAlertText(`目前該時段剩餘${reserveInfo.last}個空位`);
      setAlertOpen(true);
      return;
    }
    setHaveNewPet(true);
  };

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

  const handlePetNameChange = (value) => {
    setNewPetInfo({
      ...newPetInfo,
      petName: value,
    });
  };

  const handlePetGenderChange = (value) => {
    setNewPetInfo({
      ...newPetInfo,
      gender: value,
    });
  };

  const handlePetSpeciesChange = (value) => {
    setNewPetInfo({
      ...newPetInfo,
      species: value,
    });
  };

  const handlePetBirthdayChange = (value) => {
    setNewPetInfo({
      ...newPetInfo,
      birthday: value,
    });
  };

  const handlePetBreedChange = (value) => {
    setNewPetInfo({
      ...newPetInfo,
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

  const handleNextStepAndUpdateUserData = async () => {
    if (ownerInfo.lastName.length === 0) {
      setAlertText("請填寫飼主姓名");
      setAlertOpen(true);
      return;
    } else if (ownerInfo.phone.length === 0) {
      setAlertText("請填寫飼主聯絡電話");
      setAlertOpen(true);
      return;
    }

    try {
      await update(ref(db, "users/" + userId), ownerInfo);
    } catch (error) {
      console.log(error);
    }

    if (!haveNewPet) {
      if (selectedPets.length === 0) {
        setAlertText("請選取預約寵物")
        setAlertOpen(true)
        return
      }
      handleNextStep();
    } else if (haveNewPet) {
      if (!newPetInfo.petName) {
        setAlertText("請填寫新寵物名字");
        setAlertOpen(true);
        return
      }
      if (!newPetInfo.gender) {
        setAlertText("請填寫新寵物性別");
        setAlertOpen(true);
        return
      }
      if (!newPetInfo.birthday) {
        setAlertText("請填寫新寵物生日年分");
        setAlertOpen(true);
        return
      }
      if (!newPetInfo.breed) {
        setAlertText("請填寫新寵物品種");
        setAlertOpen(true);
        return
      }

      handleNextStep();
    }
  };

  const handleExistingPetSelection = (originalPet) => {
    setSelectedPets((prevSelectedPets) => {
      const isSeleted = prevSelectedPets.some(
        (pet) => pet.id === originalPet.id
      );
      if (isSeleted) {
        return prevSelectedPets.filter((pet) => pet.id !== originalPet.id);
      } else if (
        prevSelectedPets.length >= reserveInfo.last ||
        (haveNewPet && prevSelectedPets.length >= reserveInfo.last - 1)
      ) {
        setAlertText(`目前該時段剩餘${reserveInfo.last}個空位`);
        setAlertOpen(true);
        return prevSelectedPets;
      } else if (
        prevSelectedPets.length >= 3 ||
        (haveNewPet && prevSelectedPets.length >= 2)
      ) {
        setAlertText("一次最多預約3隻寵物");
        setAlertOpen(true);
        return prevSelectedPets;
      } else {
        return [...prevSelectedPets, originalPet];
      }
    });
  };

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
      <div className={styles.formContainer}>
        <div className={styles.infoWrapper}>
          <div className={styles.infoGroup}>
            <h4 className={styles.infoTitle}>日期</h4>
            <p className={styles.info}>{reserveInfo.date}</p>
          </div>
          <div className={styles.infoGroup}>
            <h4 className={styles.infoTitle}>時段</h4>
            <p className={styles.info}>{timeList[reserveInfo.time]}</p>
          </div>
          <div className={styles.infoGroup}>
            <h4 className={styles.infoTitle}>醫師</h4>
            <p className={styles.info}>{reserveInfo.doctor}</p>
          </div>
        </div>
        <form action="post" className={styles.form}>
          <h3 className={styles.formTitle}>飼主資料</h3>
          <div className={styles.ownerInfo}>
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
          <h3 className={styles.formTitle}>寵物資料</h3>
          {reserveInfo.last > 2 && (
            <p className={styles.describe}>{`已選擇 ${
              selectedPets.length + haveNewPet
            }/3 (一個時段最多預約三隻寵物)`}</p>
          )}
          {reserveInfo.last <= 2 && (
            <p className={styles.describe}>{`已選擇 ${
              selectedPets.length + haveNewPet
            }/${reserveInfo.last} (目前該時段剩餘${
              reserveInfo.last
            }個空位)`}</p>
          )}
          {originalPetInfo.length !== 0 && (
            <div className={styles.petInfo}>
              <h4 className={styles.petInfoTitle}>原有寵物</h4>
              <div className={styles.petInfoInputGroup}>
                {originalPetInfo.map((info) => {
                  return (
                    <div className={styles.petInfoGroup} key={info.id}>
                      <input
                        type="checkbox"
                        name="pet"
                        id={info.id.slice(1, 6)}
                        className={styles.petInfoInput}
                        onChange={() => handleExistingPetSelection(info)}
                        checked={selectedPets.some((pet) => pet.id === info.id)}
                      />
                      <label
                        htmlFor={info.id.slice(1, 6)}
                        className={styles.petInfoLabel}
                      >
                        {info.species === "feline" && (
                          <img
                            src="/svg/booking_cat.svg"
                            alt="icon"
                            className={styles.petInfoIcon}
                          />
                        )}
                        {info.species === "canine" && (
                          <img
                            src="/svg/booking_dog.svg"
                            alt="icon"
                            className={styles.petInfoIcon}
                          />
                        )}
                        {info.petName}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {!haveNewPet && (
            <button
              className={styles.addNewPet}
              onClick={handleAddNewPet}
            >
              新增寵物
            </button>
          )}
          {haveNewPet && (
            <>
              <div className={styles.newPetInfo}>
                <div className={styles.infoHeader}>
                  <h4 className={styles.petInfoTitle}>新增寵物</h4>
                  <div
                    className={styles.deleteBtn}
                    onClick={() => {
                      setHaveNewPet(false);
                    }}
                  >
                    移除
                  </div>
                </div>
                <PetInfoForm func={func} petInfo={newPetInfo} />
              </div>
            </>
          )}
          <p className={styles.point}>以上資料將同步至會員中心</p>
        </form>
        <div className={styles.submitBtnGroup}>
          <PrevBtn title={"上一步"} onClick={handlePrevStep} />
          <NextBtn title={"下一步"} onClick={handleNextStepAndUpdateUserData} />
        </div>
      </div>
    </>
  );
};

const InfoTableGroup = ({title, info, mark, icon, className}) => {
  return (
    <div className={`${styles.infoTableGroup} ${className}`}>
      <div className={styles.tableTitle}>{title}</div>
      <div className={styles.tableInfo}>{info}</div>
      {mark && <div className={styles.tableMark}>{mark}</div>}
      {icon && <img src={icon} alt="icon" className={styles.infoTableIcon} />}
    </div>
  );
}

const FormStep3 = ({
  handlePrevStep,
  handleSubmit,
  reserveInfo,
  ownerInfo,
  selectedPets,
  newPetInfo,
  setReserveNum,
  haveNewPet,
}) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user.uid;

  const db = getDatabase();

  const date = reserveInfo.date.slice(0, -4);
  const day = `(星期${reserveInfo.date.slice(-2)}`;
  const reserveTime = timeList[reserveInfo.time];
  const reserveDoctor = reserveInfo.doctor.slice(0, -5);
  const clinicNum = reserveInfo.doctor.slice(-4);
  const name = ownerInfo.lastName + " " + ownerInfo.firstName;
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
  const phone = ownerInfo.phone;
  let newPetAge = moment().format("YYYY") - newPetInfo.birthday;
  if (newPetAge <= 0) newPetAge = "未滿1";
  const getIcon = (species) => {
    let icon = "";
    switch (species) {
      case "feline":
        icon = "/svg/booking_cat.svg";
        break;
      default:
        icon = "/svg/booking_dog.svg";
    }
    return icon;
  };

  const handleReserve = async () => {
    const date = moment(reserveInfo.date).format("YYYY-MM-DD");
    const key = reserveInfo.key;
    const dateKey = `${date}_${key}`;
    const scheduleRef = ref(db, `schedule/${date}/${key}`);
    let petCount = Object.keys(selectedPets).length;
    if (haveNewPet) petCount += 1

    try {
      // 確認資料庫內可預約空位足夠
      await runTransaction(scheduleRef, (schedule) => {
        if (schedule) {
          if (
            schedule.currentAppointments + petCount >
            schedule.maxAppointments
          ) {
            throw new Error("空位不足");
          }
          schedule.currentAppointments += petCount;
        }
        return schedule;
      });

      const appointmentsRef = ref(db, "appointments");
      let reserveCount = 0;
      const queryAppointmentsRef = query(
        appointmentsRef,
        orderByChild("date_key"),
        equalTo(dateKey),
        limitToLast(1)
      );

      // 查詢當日該診之前約診號，如果有之前的約診，則約診號碼繼續遞增
      const snap = await get(queryAppointmentsRef);
      if (snap.exists()) {
        const data = snap.val();
        reserveCount = Object.values(data)[0].number;
      }

      const numberList = [];

      // 將新增寵物資料及預約資訊傳至資料庫
      if (haveNewPet) {
        try {
          const newPet = await push(ref(db, "pets/"), newPetInfo);
          const newPetKey = newPet.key;
          await update(ref(db, "pets/" + newPetKey), {
            owner_id: userId,
            isDeleted: false,
          });

          reserveCount += 1;
          numberList.push(reserveCount);
          const now = Date.now();
          const reserveData = {
            owner_id: userId,
            pet_id: newPetKey,
            number: reserveCount,
            create_at: now,
            date_key: dateKey,
            date: date,
            doctor: reserveInfo.doctor,
            pet_name: newPetInfo.petName,
            isCanceled: false,
          };
          await push(appointmentsRef, reserveData);
        } catch (error) {
          console.log(error);
        }
      }

      await Promise.all(
        Object.values(selectedPets).map(async (pet) => {
          reserveCount += 1;
          numberList.push(reserveCount);
          const now = Date.now();
          const reserveData = {
            owner_id: pet.owner_id,
            pet_id: pet.id,
            number: reserveCount,
            create_at: now,
            date_key: dateKey,
            date: date,
            doctor: reserveInfo.doctor,
            pet_name: pet.petName,
            isCanceled: false,
          };
          await push(appointmentsRef, reserveData);
        })
      );

      setReserveNum(numberList);
      handleSubmit();
    } catch (error) {
      if (error.message === "空位不足") {
        setAlertText("預約失敗，目前剩餘空位不足，請選擇其他時段");
        setAlertOpen(true);
      } else {
        console.error("預約失敗:", error);
        setAlertText("預約失敗，請稍後再試");
        setAlertOpen(true);
      }
    }
  };

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
      <div className={styles.formContainer}>
        <div className={styles.form}>
          <div className={styles.infoTable}>
            <h3 className={styles.formTitle}>預約門診</h3>
            <InfoTableGroup
              title={"日期"}
              info={date}
              mark={day}
              className={styles.bookingInfo}
            />
            <InfoTableGroup
              title={"時段"}
              info={reserveTime}
              className={styles.bookingInfo}
            />
            <InfoTableGroup
              title={"醫師"}
              info={reserveDoctor}
              mark={clinicNum}
              className={styles.bookingInfo}
            />
          </div>
          <div className={styles.infoTable}>
            <h3 className={styles.formTitle}>飼主資料</h3>
            <InfoTableGroup
              title={"姓名"}
              info={name}
              mark={gender}
              className={styles.bookingInfo}
            />
            <InfoTableGroup
              title={"手機號碼"}
              info={phone}
              className={styles.bookingInfo}
            />
          </div>
          <div className={styles.infoTable}>
            <h3 className={styles.formTitle}>寵物資料</h3>
            {selectedPets.map((pet, index) => {
              let age = moment().format("YYYY") - pet.birthday;
              if (age <= 0) age = "未滿1";
              const icon = getIcon(pet.species);
              return (
                <>
                  <InfoTableGroup
                    title={`寵物${index + 1}`}
                    info={pet.petName}
                    mark={`(${age}歲 · ${pet.breed})`}
                    icon={icon}
                    className={styles.bookingInfo}
                  />
                </>
              );
            })}
            {haveNewPet && (
              <InfoTableGroup
                title={"新寵物"}
                info={newPetInfo.petName}
                mark={`(${newPetAge}歲 · ${newPetInfo.breed})`}
                icon={getIcon(newPetInfo.species)}
                className={styles.bookingInfo}
              />
            )}
          </div>
        </div>
        <div className={styles.submitBtnGroup}>
          <PrevBtn title={"上一步"} onClick={handlePrevStep} />
          <NextBtn title={"確認預約"} onClick={handleReserve} />
        </div>
      </div>
    </>
  );
};

const FormStep4 = ({ reserveNum, reserveInfo }) => {
  const navigate = useNavigate();
  const date = reserveInfo.date
  const reserveTime = timeList[reserveInfo.time];
  const endTime = reserveTime.split(" ~ ")[1]
  const deadlineTime = moment(endTime, "HH:mm")
    .subtract(30, "minutes")
    .format("HH:mm");

  const handleToHomepage = () => {
    navigate("/");
  };

  const handleToRecord = () => {
    navigate("/user/records");
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.confirmForm}>
        <h3 className={styles.confirmFormTitle}>你的看診號碼為</h3>
        <div className={styles.bookingNum}>{reserveNum.join(". ")}</div>
        <div className={styles.remind}>
          已預約於{" "}
          <span className={styles.bookingTime}>
            {date} {reserveTime}{" "}
          </span>
          時段
          <br />
          值班醫師
          <span className={styles.bookingTime}> {reserveInfo.doctor}</span>
          <br />
          截止報到時間為當日
          <span className={styles.bookingTime}> {deadlineTime}</span>
          <br />
          實際看診時間依現場狀況為主，謝謝您的預約！
        </div>
        <div className={styles.notice}>
          <h4 className={styles.noticeTitle}>注意事項</h4>
          <ul>
            <li className={styles.note}>
              若過號將由現場人員依現場狀況安排看診，怒不接受指定時間
            </li>
            <li className={styles.note}>
              若需修改預約時間，請至會員中心 {">"} 預約記錄修改
            </li>
            <li className={styles.note}>
              若多次無故未到場報到，本院有權取消會員之預約資格
            </li>
            <li className={styles.note}>若有其他疑問敬請來電 0223456789</li>
          </ul>
        </div>
      </div>
      <div className={styles.submitBtnGroup}>
        <PrevBtn title={"返回首頁"} onClick={handleToHomepage} />
        <NextBtn title={"查看預約紀錄"} onClick={handleToRecord} />
      </div>
    </div>
  );
};

export {
  Container,
  StepGroup,
  FormStep1,
  FormStep2,
  FormStep3,
  FormStep4,
  InfoTableGroup,
  NameInput,
  PhoneInput,
  PetInfoForm,
};