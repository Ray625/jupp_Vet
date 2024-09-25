import { useNavigate, useLocation,  } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDatabase, ref, onValue, off, get, query, orderByChild, equalTo } from "firebase/database";

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
  const [schedule, setSchedule] = useState([]);

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
    const db = getDatabase()
    const scheduleRef = ref(db, "schedule")
    const monthSchedule = query(scheduleRef, orderByChild("month"), equalTo("2024-09"));
    get(monthSchedule).then((snap) => {
      if (snap.exists()) {
        const data = snap.val();
        // const shiftList = [];
        // for (const [date, room] of Object.entries(data)) {
        //   const dayData = {
        //     date,
        //     shift: [],
        //   };
        //   Object.values(room).forEach((item) => {
        //     if (item.name) {
        //       dayData.shift.push({
        //         doc: item.name,
        //         time: item.time,
        //         room: item.room,
        //       });
        //     }
        //   });
        //   shiftList.push(dayData);
        // }
        setSchedule(data);
      }
    });
  }, [])

  console.log(schedule);


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
            <Outlet context={{ doctorsList, schedule }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BackstageLayout;