import { useNavigate, useLocation,  } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDatabase, ref, onValue, off, get, query, orderByChild, equalTo } from "firebase/database";
import moment from "moment";

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
];

const NavBtn = ({ props }) => {
  const { pathname } = useLocation();
  const { text, path } = props;
  const navigate = useNavigate();

  return (
    <button
      className={`rounded p-4 w-32 text-start hover:bg-primary-blue hover:text-white ${
        pathname === path && "bg-primary-blue text-white"
      }`}
      onClick={() => navigate(path)}
    >
      {text}
    </button>
  );
};

const BackstageLayout = () => {
  const [doctorsList, setDoctorsList] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [prevMonthSchedule, setPrevMonthSchedule] = useState({})
  const [nextMonthSchedule, setNextMonthSchedule] = useState({})
  const [selectMonth, setSelectMonth] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    const db = getDatabase();
    const doctorRef = ref(db, "doctors");
    onValue(doctorRef, (snap) => {
      if (snap.exists()) {
        const list = snap.val();
        const docData = [];
        for (const [key, value] of Object.entries(list)) {
          docData.push({
            ...value,
            id: key,
          });
        }
        setDoctorsList(docData);
      }
    });

    return () => {
      off(doctorRef);
    };
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const scheduleRef = ref(db, "schedule");
    const monthSchedule = query(
      scheduleRef,
      orderByChild("month"),
      equalTo(selectMonth)
    );
    const nextMonth = moment(selectMonth).add(1, "M").format("YYYY-MM");
    const nextMonthSchedule = query(
      scheduleRef,
      orderByChild("month"),
      equalTo(nextMonth)
    );
    const prevMonth = moment(selectMonth).subtract(1, "M").format("YYYY-MM");
    const prevMonthSchedule = query(
      scheduleRef,
      orderByChild("month"),
      equalTo(prevMonth)
    );

    onValue(monthSchedule, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setSchedule(data);
      } else {
        setSchedule({});
      }
    });

    onValue(prevMonthSchedule, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setPrevMonthSchedule(data);
      } else {
        setPrevMonthSchedule({});
      }
    });

    onValue(nextMonthSchedule, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setNextMonthSchedule(data);
      } else {
        setNextMonthSchedule({});
      }
    });

    return () => {
      off(monthSchedule);
      off(prevMonthSchedule);
      off(nextMonthSchedule);
    };
  }, [selectMonth]);

  useEffect(() => {
    const currentMonth = moment().format("YYYY-MM")
    setSelectMonth(currentMonth);
  }, [])


  return (
    <div className="container-none h-screen flex flex-col">
      <div className="w-full p-8 bg-footer-blue">
        <div className="container flex flex-row justify-between mx-auto">
          <h2 className="text-xl w-fit text-white">動物醫院後台</h2>
          <button
            className="text-white hover:opacity-80"
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
                nextMonthSchedule
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BackstageLayout;