import styles from "./BookingPage.module.scss";
import { Container, StepGroup, FormStep1, FormStep2, FormStep3, FormStep4 } from '../../components/booking/booking'
import useTheme from '../../hooks/useTheme'
import { useState, useEffect } from 'react'
import { getDatabase, onValue, ref, query, orderByChild, equalTo, off } from "firebase/database";
import moment from "moment";

const BookingPage = () => {
  const { tickerOpen } = useTheme()
  const [step, setStep] = useState(1)
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0)
  const [reserveInfo, setReserveInfo] = useState({ date: '', time: '', doctor: '', key: '', last:null })
  const [ownerInfo, setOwnerInfo] = useState({ lastName: '', firstName: '', gender: 'male', phone: '' })
  const [newPetInfo, setNewPetInfo] = useState({ petName: '', gender: '', species: 'canine', birthday: '', breed: '' })
  const [selectedPets, setSelectedPets] = useState([])
  const [reserveData, setReserveData] = useState({})
  const [reserveNum, setReserveNum] = useState([])
  const [haveNewPet, setHaveNewPet] = useState(false);


  const handleToStep2 = () => {
    if (reserveInfo.date.length === 0) {
      return alert('請選擇預約日期')
    } else if (reserveInfo.time.length === 0) {
      return alert('請選擇預約時段')
    } else if (reserveInfo.doctor.length === 0) {
      return alert('請選擇醫師')
    }

    setStep(s => s + 1)
  }

  const handleToStep3 = () => {
    setStep(s => s + 1)
  }

  const handlePrevStep = () => {
    setStep(s => s - 1)
  }

  const handleSubmit = () => {
    setStep(s => s + 1)
  }

  useEffect(() => {
    if (step) {
      window.scrollTo(0, 0);
    }
  }, [step])

  // 依使用者所選時段，至資料庫抓取對應的門診
  useEffect(() => {
    const db = getDatabase()
    if (reserveInfo.date.length === 0) return
    if (reserveInfo.time.length === 0) return
    const date = moment(reserveInfo.date).format("YYYY-MM-DD")
    const shift = reserveInfo.time
    const queryRef = query(
      ref(db, "schedule/" + date),
      orderByChild("shift"),
      equalTo(shift)
    );
    onValue(queryRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setReserveData(data)
      } else {
        setReserveData({})
      }
    });

    return () => {
      off(queryRef);
    }

  }, [reserveInfo]);

  return (
    <div
      className={styles.container}
      style={{ paddingTop: tickerOpen ? "124px" : "80px" }}
    >
      <Container
        title="Booking Now"
        subitle="線上預約"
        titleBgClassName={styles.bookingBg}
        containerBgClassName={styles.containerBg}
      >
        <StepGroup step={step} />
        {step === 1 && (
          <FormStep1
            handleNextStep={handleToStep2}
            selectedWeekIndex={selectedWeekIndex}
            setSelectedWeekIndex={setSelectedWeekIndex}
            reserveInfo={reserveInfo}
            reserveData={reserveData}
            setReserveInfo={setReserveInfo}
          />
        )}
        {step === 2 && (
          <FormStep2
            handlePrevStep={handlePrevStep}
            handleNextStep={handleToStep3}
            reserveInfo={reserveInfo}
            reserveData={reserveData}
            ownerInfo={ownerInfo}
            setOwnerInfo={setOwnerInfo}
            newPetInfo={newPetInfo}
            setNewPetInfo={setNewPetInfo}
            selectedPets={selectedPets}
            setSelectedPets={setSelectedPets}
            haveNewPet={haveNewPet}
            setHaveNewPet={setHaveNewPet}
          />
        )}
        {step === 3 && (
          <FormStep3
            handlePrevStep={handlePrevStep}
            handleSubmit={handleSubmit}
            reserveInfo={reserveInfo}
            ownerInfo={ownerInfo}
            selectedPets={selectedPets}
            newPetInfo={newPetInfo}
            setReserveNum={setReserveNum}
            haveNewPet={haveNewPet}
          />
        )}
        {step === 4 && (
          <FormStep4 reserveNum={reserveNum} reserveInfo={reserveInfo} />
        )}
      </Container>
    </div>
  );
}


export default BookingPage;