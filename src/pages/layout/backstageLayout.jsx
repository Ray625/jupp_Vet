import { useNavigate, useLocation } from "react-router-dom"
import { Outlet } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  getDatabase,
  ref,
  onValue,
  off,
  get,
  query,
  orderByChild,
  equalTo,
  startAt,
  endAt
} from "firebase/database"
import moment from "moment"
import useAuth from "../../hooks/useAuth"

const navList = [
  {
    text: "醫師名單",
    path: "/backstage",
  },
  {
    text: "班表",
    path: "/backstage/schedule",
  },
  {
    text: "約診紀錄",
    path: "/backstage/records",
  },
  {
    text: "使用者列表",
    path: "/backstage/users",
  },
]

const NavBtn = ({ props }) => {
  const { pathname } = useLocation()
  const { text, path } = props
  const navigate = useNavigate()

  return (
    <button
      className={`rounded p-4 w-32 text-start transition-all duration-200 hover:bg-primary-blue hover:text-white ${
        pathname === path && "bg-primary-blue text-white"
      }`}
      onClick={() => navigate(path)}
    >
      {text}
    </button>
  );
}

const BackstageLayout = () => {
  const { currentUser } = useAuth()
  // 醫師列表
  const [doctorsList, setDoctorsList] = useState([])

  // 班表
  const [schedule, setSchedule] = useState({})
  const [prevMonthSchedule, setPrevMonthSchedule] = useState({})
  const [nextMonthSchedule, setNextMonthSchedule] = useState({})
  const currentMonth = moment().format("YYYY-MM")
  const [selectMonth, setSelectMonth] = useState(currentMonth)

  // 約診紀錄
  const [records, setRecords] = useState([])
  const [recordsData, setRecordsData] = useState([])
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    doctor: "all",
    keywords: "",
  })

  // 使用者名單
  const [users, setUsers] = useState([])
  const [usersData, setUsersData] = useState([])
  const [userFilters, setUserFilters] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser || currentUser.email !== "admin001@gmail.com") {
      navigate('/')
    }
  },[currentUser, navigate])

  // 從資料庫抓取醫師列表資料
  useEffect(() => {
    const db = getDatabase()
    const doctorRef = ref(db, "doctors")
    onValue(doctorRef, (snap) => {
      if (snap.exists()) {
        const list = snap.val()
        const docData = []
        for (const [key, value] of Object.entries(list)) {
          docData.push({
            ...value,
            id: key,
          })
        }
        setDoctorsList(docData)
      }
    })

    return () => {
      off(doctorRef)
    }
  }, [])

  // 從資料庫抓取班表資料
  useEffect(() => {
    const db = getDatabase()
    const scheduleRef = ref(db, "schedule")
    const monthSchedule = query(
      scheduleRef,
      orderByChild("month"),
      equalTo(selectMonth)
    )
    const nextMonth = moment(selectMonth).add(1, "M").format("YYYY-MM")
    const nextMonthSchedule = query(
      scheduleRef,
      orderByChild("month"),
      equalTo(nextMonth)
    )
    const prevMonth = moment(selectMonth).subtract(1, "M").format("YYYY-MM")
    const prevMonthSchedule = query(
      scheduleRef,
      orderByChild("month"),
      equalTo(prevMonth)
    )

    onValue(monthSchedule, (snap) => {
      if (snap.exists()) {
        const data = snap.val()
        setSchedule(data)
      } else {
        setSchedule({})
      }
    })

    onValue(prevMonthSchedule, (snap) => {
      if (snap.exists()) {
        const data = snap.val()
        setPrevMonthSchedule(data)
      } else {
        setPrevMonthSchedule({})
      }
    })

    onValue(nextMonthSchedule, (snap) => {
      if (snap.exists()) {
        const data = snap.val()
        setNextMonthSchedule(data)
      } else {
        setNextMonthSchedule({})
      }
    })

    return () => {
      off(monthSchedule)
      off(prevMonthSchedule)
      off(nextMonthSchedule)
    }
  }, [selectMonth])

  // 依據時間區間抓取約診紀錄，預設為最新的資料
  useEffect(() => {
    const db = getDatabase()
    let recordsRef = ref(db, "appointments")

    // filters有區間時，將只抓取區間內資料
    if (filters.startDate && filters.endDate) {
      recordsRef = query(
        ref(db, "appointments"),
        orderByChild("date"),
        startAt(filters.startDate),
        endAt(filters.endDate)
      )
    }

    onValue(recordsRef, (snap) => {
      if (snap.exists()) {
        const list = snap.val()
        const recordsData = []
        for (const [key, value] of Object.entries(list)) {
          recordsData.push({
            ...value,
            id: key,
          })
        }

        // 將資料按照預約時間排序
        recordsData.sort((a, b) => {
          return (
            new Date(b.date_key.split("_")[0]) -
            new Date(a.date_key.split("_")[0])
          )
        })
        setRecords(recordsData)
      }
    })

    return () => {
      off(recordsRef)
    }
  }, [filters])

  // 將約診紀錄與飼主及寵物資料整理合併，若filters有條件則做篩選處理
  useEffect(() => {
    const fetchOwnerAndPets = async (records) => {
      const db = getDatabase()
      const ownerIds = [...new Set(records.map((record) => record.owner_id))]
      const petIds = [...new Set(records.map((record) => record.pet_id))]

      try {
        const ownerPromises = ownerIds.map((ownerId) =>
          get(ref(db, `users/${ownerId}`))
        )

        const petPromises = petIds.map((petId) =>
          get(ref(db, `pets/${petId}`))
        )

        const [ownersSnap, petSnap] = await Promise.all([
          Promise.all(ownerPromises),
          Promise.all(petPromises),
        ])

        const ownerData = {}
        const petData = {}

        ownersSnap.forEach((snap) => {
          if (snap.exists()) {
            ownerData[snap.key] = snap.val()
          }
        })

        petSnap.forEach((snap) => {
          if (snap.exists()) {
            petData[snap.key] = snap.val()
          }
        })

        const finalRecords = records.map((record) => ({
          ...record,
          owner: ownerData[record.owner_id] || null,
          pet: petData[record.pet_id] || null,
        }))

        return finalRecords
      } catch (error) {
        console.error("Error fetching owners or pets:", error)
        throw error
      }
    }

    const loadData = async () => {
      const finalData = await fetchOwnerAndPets(records)

      setRecordsData(finalData)
      let filterDoctorData = finalData

      if (filters.doctor !== "all") {
        filterDoctorData = finalData.filter((record) =>
          record.doctor.includes(filters.doctor)
        )
        setRecordsData(filterDoctorData)
      }

      if (filters.keywords.length !== 0) {
        const filterData = filterDoctorData.filter((record) => {
          const keywords = filters.keywords.toLowerCase()
          return (
            record.pet_name.toLowerCase().includes(keywords) ||
            record.owner.firstName.toLowerCase().includes(keywords) ||
            record.owner.lastName.toLowerCase().includes(keywords) ||
            record.owner.phone.includes(keywords) ||
            record.owner.email.toLowerCase().includes(keywords)
          )
        })
        if (filterData.length > 0) setRecordsData(filterData)
      }
    }

    if (records.length > 0) {
      loadData()
    }
  }, [records, filters])

  // 從資料庫抓取users資料
  useEffect(() => {
    const db = getDatabase()
    const usersRef = ref(db, "users")

    onValue(usersRef, (snap) => {
      if (snap.exists()) {
        const list = snap.val()
        const usersData = []
        for (const [key, value] of Object.entries(list)) {
          if (value.email === "admin001@gmail.com") continue
          usersData.push({
            ...value,
            id: key,
          })
        }

        // 將資料按照創建時間排序
        usersData.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt)
        })
        setUsers(usersData)
      }
    })

    return () => {
      off(usersRef)
    }
  }, [])

  useEffect(() => {
    const fetchOwnersPets = async (users) => {
      const db = getDatabase()
      const ownerIds = []
      users.map((user) => ownerIds.push(user.id))

      try {
        const petPromises = ownerIds.map((ownerId) =>
          get(query(ref(db, "pets"), orderByChild("owner_id"), equalTo(ownerId)))
        )

        const petSnap = await Promise.all(petPromises)

        const petData = {}

        petSnap.forEach((snap) => {
          if (snap.exists()) {
            const pets = snap.val()
            for (const petId in pets) {
              const pet = pets[petId]
              if (!petData[pet.owner_id]) {
                petData[pet.owner_id] = {}
              }
              petData[pet.owner_id][pet.petName] = pet
            }
          }
        })

        const finalUsers = users.map((user) => ({
          ...user,
          pets: petData[user.id] || null,
        }))

        return finalUsers
      } catch (error) {
        console.error("Error fetching users:", error)
        throw error
      }
    }

    const loadData = async () => {
      const finalData = await fetchOwnersPets(users)

      setUsersData(finalData)
      if (userFilters.length !== 0) {
        const filterData = finalData.filter((user) => {
          const keywords = userFilters.toLowerCase();
          return (
            (user.pets && typeof user.pets === "object" && Object.prototype.hasOwnProperty.call(user.pets, keywords)) ||
            user.firstName?.toLowerCase().includes(keywords) ||
            user.lastName?.toLowerCase().includes(keywords) ||
            user.phone?.includes(keywords) ||
            user.email?.toLowerCase().includes(keywords)
          );
        });
        if (filterData.length > 0) setUsersData(filterData);
      }
    }

    if (users.length > 0) {
      loadData()
    }
  }, [users, userFilters])

  return (
    <div className="container-none h-screen flex flex-col font-sans">
      <div className="w-full p-8 bg-footer-blue">
        <div className="container flex flex-row justify-between mx-auto">
          <h2 className="text-xl w-fit text-white">動物醫院後台</h2>
          <button
            className="text-white hover:opacity-80 transition-all duration-200"
            onClick={() => navigate("/")}
          >
            <i className="fa-solid fa-arrow-right-from-bracket fa-lg"></i>
          </button>
        </div>
      </div>
      <div className="h-full bg-bg-gray">
        <div className="container flex flex-row h-full mx-auto">
          <div className="flex flex-col items-start gap-y-1 w-48 p-8 text-lg h-full">
            {navList.map((item) => (
              <NavBtn props={item} key={item.text} />
            ))}
          </div>
          <div className="w-full">
            <Outlet
              context={{
                doctorsList,
                schedule,
                selectMonth,
                setSelectMonth,
                prevMonthSchedule,
                nextMonthSchedule,
                recordsData,
                filters,
                setFilters,
                usersData,
                userFilters,
                setUserFilters
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BackstageLayout
