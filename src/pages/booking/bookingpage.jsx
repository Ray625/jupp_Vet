import styles from "./BookingPage.module.scss";
import { Container, StepGroup, FormStep1, FormStep2, FormStep3, FormStep4 } from '../../components/booking/booking'
import useTheme from '../../hooks/useTheme'
import { useState, useEffect } from 'react'

const BookingPage = () => {
  const { tickerOpen } = useTheme()
  const [step, setStep] = useState(1)
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0)
  const [reserveInfo, setReserveInfo] = useState({ date: '', time: '', doctor: '' })
  const [ownerInfo, setOwnerInfo] = useState({ lastName: '', firstName: '', gender: 'male', phone: '' })
  const [newPetInfo, setNewPetInfo] = useState({ petName: '', gender: '', species: 'canine', birthday: '', breed: '' })
  const [selectedPets, setSelectedPets] = useState([]);


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
    alert('submit')
    setStep(s => s + 1)
  }

  useEffect(() => {
    if (step) {
      window.scrollTo(0, 0);
    }
  }, [step])

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
            setReserveInfo={setReserveInfo}
          />
        )}
        {step === 2 && (
          <FormStep2
            handlePrevStep={handlePrevStep}
            handleNextStep={handleToStep3}
            reserveInfo={reserveInfo}
            ownerInfo={ownerInfo}
            setOwnerInfo={setOwnerInfo}
            newPetInfo={newPetInfo}
            setNewPetInfo={setNewPetInfo}
            selectedPets={selectedPets}
            setSelectedPets={setSelectedPets}
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
          />
        )}
        {step === 4 && <FormStep4 />}
      </Container>
    </div>
  );
}


export default BookingPage;