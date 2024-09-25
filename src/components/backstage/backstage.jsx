import { useState } from "react";
import {
  getDatabase,
  ref,
  update,
  remove,
  push,
  set,
  get,
} from "firebase/database";
import moment from "moment";
import { useOutletContext } from "react-router-dom";

const week = ["mon", "tue", "wed", "thu", "fri", "sat"];
const weekCh = ["一", "二", "三", "四", "五", "六"];

const EditInput = ({
  editDoctor,
  handleNameChange,
  handleShiftChange,
  handleSave,
  handleCancel,
}) => {
  return (
    <div className="flex flex-row items-center gap-4 px-4 py-3 bg-bg-gray rounded-lg">
      <input
        type="text"
        className="rounded w-20 h-8 py-1 px-2"
        value={editDoctor.name}
        onChange={(e) => handleNameChange(e.target.value)}
      />
      <div className="flex flex-row justify-center items-center gap-2 flex-grow font-normal">
        <div className="flex flex-col gap-1 pt-8 pb-0 text-center">
          <label className="text-sm">早班</label>
          <label className="text-sm">晚班</label>
          <label className="text-sm p-0">休</label>
        </div>
        {week.map((day, index) => {
          return (
            <div className="flex flex-col gap-2" key={day}>
              <label>{weekCh[index]}</label>
              <input
                type="radio"
                name={day}
                className="w-4 h-4 cursor-pointer"
                value="早"
                checked={editDoctor.work[day] === "早"}
                onChange={(e) => handleShiftChange(day, e.target.value)}
              />
              <input
                type="radio"
                name={day}
                value="晚"
                className="w-4 h-4 cursor-pointer"
                checked={editDoctor.work[day] === "晚"}
                onChange={(e) => handleShiftChange(day, e.target.value)}
              />
              <input
                type="radio"
                name={day}
                value={null}
                className="w-4 h-4 cursor-pointer"
                checked={!editDoctor.work[day]}
                onChange={(e) => handleShiftChange(day, e.target.value)}
              />
            </div>
          );
        })}
      </div>
      <button
        className="flex justify-start items-center w-3.5 hover:opacity-80"
        onClick={handleSave}
      >
        <i className="fa-solid fa-check text-center"></i>
      </button>
      <button
        className="flex justify-start items-center w-3.5 hover:opacity-80"
        onClick={handleCancel}
      >
        <i className="fa-solid fa-xmark text-center"></i>
      </button>
    </div>
  );
};

const NewBtn = ({ onClick, text }) => {
  return (
    <button
      className="w-fit mx-auto mt-4 px-8 py-4 border border-icon-orange border-solid rounded-full bg-icon-orange text-white hover:bg-white hover:text-icon-orange"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

const Doctors = () => {
  const { doctorsList } = useOutletContext();
  const [editDoctor, setEditDoctor] = useState({
    name: "",
    work: {
      mon: null,
      tue: null,
      wed: null,
      thu: null,
      fri: null,
      sat: null,
    },
  });
  const [newDoctor, setNewDoctor] = useState(false);
  const [editing, setEditing] = useState(false);

  const db = getDatabase();

  const handleNameChange = (value) => {
    setEditDoctor((prev) => ({
      ...prev,
      name: value,
    }));
  };

  const handleShiftChange = (day, shift) => {
    setEditDoctor((prev) => ({
      ...prev,
      work: {
        ...prev.work,
        [day]: shift,
      },
    }));
  };

  const handleNewDoctor = () => {
    setNewDoctor(true);
  };

  const handleCancelNewDoctor = () => {
    setEditDoctor({
      name: "",
      work: {
        mon: null,
        tue: null,
        wed: null,
        thu: null,
        fri: null,
        sat: null,
      },
    });
    setNewDoctor(false);
    setEditing(false);
  };

  const handleSaveNewDoctor = async () => {
    if (!editDoctor?.name?.length) {
      alert("請輸入醫師姓名");
      return;
    }

    const docRef = ref(db, "doctors");
    try {
      await push(docRef, editDoctor);
    } catch (error) {
      console.log(error);
    }
    setEditDoctor({
      name: "",
      work: {
        mon: null,
        tue: null,
        wed: null,
        thu: null,
        fri: null,
        sat: null,
      },
    });
    setNewDoctor(false);
  };

  const handleDeleteDoctor = (docId, docName) => {
    const resulf = confirm(`刪除 ${docName} 的資料?`);
    if (resulf) remove(ref(db, "doctors/" + docId));
    else return;
  };

  const handleEditDoctor = (doc) => {
    setEditDoctor(doc);
    setEditing(true);
  };

  const handleSaveEditDoctor = async () => {
    const { id, ...docData } = editDoctor;

    try {
      await update(ref(db, "doctors/" + id), docData);
    } catch (error) {
      console.log(error);
    }

    setEditDoctor({
      name: "",
      work: {
        mon: null,
        tue: null,
        wed: null,
        thu: null,
        fri: null,
        sat: null,
      },
    });
    setEditing(false);
  };

  return (
    <div className="flex flex-col mx-auto py-8 w-8/12 h-full">
      <h3 className="text-black text-2xl font-medium">醫師名單</h3>
      <div className="flex flex-col mt-8 px-4 py-8 gap-4 bg-white rounded-lg">
        <div className="flex flex-row gap-4">
          <p className="text-xl font-medium px-4 w-20">醫師</p>
          <p className="text-xl font-medium flex-grow pr-20 text-center">
            值班日
          </p>
        </div>
        {editing && (
          <EditInput
            editDoctor={editDoctor}
            handleNameChange={handleNameChange}
            handleShiftChange={handleShiftChange}
            handleSave={handleSaveEditDoctor}
            handleCancel={handleCancelNewDoctor}
          />
        )}
        {!editing &&
          doctorsList.map((doc) => {
            const work = doc.work;
            return (
              <div
                className="flex flex-row gap-4 p-4 bg-bg-gray rounded-lg"
                key={doc.name}
              >
                <p className="font-normal w-20">{doc.name}</p>
                <p className="font-normal flex-grow text-center">
                  {`${work.mon ? `週一(${work.mon})` : ""}`}{" "}
                  {`${work.tue ? `週二(${work.tue})` : ""}`}{" "}
                  {`${work.wed ? `週三(${work.wed})` : ""}`}{" "}
                  {`${work.thu ? `週四(${work.thu})` : ""}`}{" "}
                  {`${work.fri ? `週五(${work.fri})` : ""}`}{" "}
                  {`${work.sat ? `週六(${work.sat})` : ""}`}
                </p>
                <button
                  className="hover:opacity-80"
                  onClick={() => handleEditDoctor(doc)}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  className="hover:opacity-80"
                  onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            );
          })}
        {newDoctor && !editing && (
          <EditInput
            editDoctor={editDoctor}
            handleNameChange={handleNameChange}
            handleShiftChange={handleShiftChange}
            handleSave={handleSaveNewDoctor}
            handleCancel={handleCancelNewDoctor}
          />
        )}
        {!newDoctor && !editing && (
          <NewBtn onClick={handleNewDoctor} text="新增醫師" />
        )}
      </div>
    </div>
  );
};

const Schedule = () => {
  const { doctorsList, schedule } = useOutletContext();
  const [newSchedule, setNewSchedule] = useState({})
  const [emptyBox, setEmptyBox] = useState(0)
  const nextMonth = moment().add(1, "months").format("YYYY-MM");
  const monthAfterNext = moment().add(2, "months").format("YYYY-MM");

  const db = getDatabase();

  // 依照醫師名單之設定產生單日班表
  const handleGetDateSchedule = (time) => {
    const day = moment(time).format("ddd").toLowerCase();
    const date = moment(time).format("YYYY-MM-DD");
    const month = moment(time).format("YYYY-MM");

    const schedule = {};

    for (let [index, item] of doctorsList.entries()) {
      if (!item.work[day]) continue;
      const room = index + 1;
      if (item.work[day] === "早") {
        schedule[`room${room}-shift1`] = {};
        schedule[`room${room}-shift1`]["name"] = item.name;
        schedule[`room${room}-shift1`]["room"] = room;
        schedule[`room${room}-shift1`]["shift"] = "shift1";
        schedule[`room${room}-shift1`]["currentAppointments"] = 0;
        schedule[`room${room}-shift1`]["maxAppointments"] = 6;

        schedule[`room${room}-shift2`] = {};
        schedule[`room${room}-shift2`]["name"] = item.name;
        schedule[`room${room}-shift2`]["room"] = room;
        schedule[`room${room}-shift2`]["shift"] = "shift2";
        schedule[`room${room}-shift2`]["currentAppointments"] = 0;
        schedule[`room${room}-shift2`]["maxAppointments"] = 6;
      }

      if (item.work[day] === "晚") {
        schedule[`room${room}-shift2`] = {};
        schedule[`room${room}-shift2`]["name"] = item.name;
        schedule[`room${room}-shift2`]["room"] = room;
        schedule[`room${room}-shift2`]["shift"] = "shift2";
        schedule[`room${room}-shift2`]["currentAppointments"] = 0;
        schedule[`room${room}-shift2`]["maxAppointments"] = 6;

        schedule[`room${room}-shift3`] = {};
        schedule[`room${room}-shift3`]["name"] = item.name;
        schedule[`room${room}-shift3`]["room"] = room;
        schedule[`room${room}-shift3`]["shift"] = "shift3";
        schedule[`room${room}-shift3`]["currentAppointments"] = 0;
        schedule[`room${room}-shift3`]["maxAppointments"] = 6;
      }
    }

    const updates = {
      [date]: {
        ...schedule,
        ["month"]: month,
      },
    };

    return { updates };
  };

  // 依照醫師名單設定，產生參數月份班表
  const handleNewOneMonthSchedule = (time) => {
    const monthLastDay = moment(`${time}-01`)
      .add(1, "month")
      .subtract(1, "days")
      .format("DD");
    const dayOfWeek = moment(`${time}-01`).format('d')

    const list = {};
    for (let i = 1; i <= Number(monthLastDay); i++) {
      const dayOfWeek = moment(`${time}-${i}`).format("d");
      if (dayOfWeek === "0") continue;
      const day = moment(`${time}-${i}`).format("YYYY-MM-DD");
      const { updates } = handleGetDateSchedule(day);
      list[day] = updates[day];
    }

    return { list, dayOfWeek };
  };

  const handleNewSchedule = async (time) => {
    const { updates } = handleGetDateSchedule(time);
    const scheduleRef = ref(db, "schedule");
    try {
      await update(scheduleRef, updates);
    } catch (error) {
      console.log(error);
    }
    alert(`已建置${time}`);
  };

  const handleTimeSelect = (e) => {
    const time = e.target.value;
    if (time === 'none') {
      setNewSchedule({});
      return
    } else {
      const { list, dayOfWeek } = handleNewOneMonthSchedule(time);
      setNewSchedule(list);
      setEmptyBox(dayOfWeek);
    };
  }

  return (
    <div className="flex flex-col mx-auto py-8 w-8/12 h-full">
      <h3 className="text-black text-2xl font-medium">批次產生班表</h3>
      <select
        name="time"
        id="time"
        className="w-fit h-8 mt-4 px-1 rounded"
        onChange={handleTimeSelect}
      >
        <option value={"none"}>請選擇</option>
        <option value={nextMonth}>{nextMonth}月</option>
        <option value={monthAfterNext}>{monthAfterNext}月</option>
      </select>
      <PreviewSchedule
        newSchedule={newSchedule}
        setNewSchedule={setNewSchedule}
        emptyBox={emptyBox}
      />
      <NewBtn onClick={() => handleNewSchedule()} text="新增班表" />
    </div>
  );
};

const PreviewSchedule = ({ newSchedule, setNewSchedule, emptyBox }) => {
  const placeholderArray = Array.from({ length: Number(emptyBox) }, (_, i) => (
    <div className="w-20 h-20 rounded bg-white" key={`empty-${i}`}></div>
  ));

  return (
    <>
      {Object.keys(newSchedule).length !== 0 && (
        <div className="relative w-fit h-fit mt-1">
          <div className="flex flex-row w-fit gap-1 bg-white rounded my-1">
            <div className="flex items-center justify-center w-20 h-8 ">日</div>
            <div className="flex items-center justify-center w-20 h-8">一</div>
            <div className="flex items-center justify-center w-20 h-8">二</div>
            <div className="flex items-center justify-center w-20 h-8">三</div>
            <div className="flex items-center justify-center w-20 h-8">四</div>
            <div className="flex items-center justify-center w-20 h-8">五</div>
            <div className="flex items-center justify-center w-20 h-8">六</div>
          </div>
          <div className="grid grid-cols-7 auto-rows-min gap-1 w-fit h-fit">
            {placeholderArray}
            {Object.entries(newSchedule).map(([key, value]) => {
              return (
                <DayFrame
                  time={key}
                  key={key}
                  data={value}
                  setNewSchedule={setNewSchedule}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

const DayFrame = ({ time, data, setNewSchedule }) => {
  const [enlarge, setEnlarge] = useState(false);
  const date = moment(time).format("D");
  const month = moment(time).format("YYYY / M");
  const day = "日一二三四五六"[moment(time).format("d")];
  // console.log("data:", date, data);

  return (
    <>
      <div
        className="flex flex-col bg-white cursor-pointer w-20 h-20 rounded p-2 relative"
        onClick={() => setEnlarge(true)}
      >
        <div className="text-right">{date}</div>
      </div>
      {enlarge && (
        <div
          className="flex flex-col w-full h-full py-6 px-4 bg-white absolute top-0 left-0 rounded z-10"
          // onClick={() => setEnlarge(false)}
        >
          <div className={"flex flex-row text-end w-full justify-end text-xl"}>
            <div className="mr-1">{`${month} /`}</div>
            <div className="">{date}</div>
            <div className="ml-1">{`(${day})`}</div>
          </div>
          <div className="grid grid-cols-[48px_repeat(3,_minmax(0,_1fr))] grid-rows-[48px_repeat(3,_minmax(0,_1fr))] w-full h-full mt-2 py-4 border-t border-solid border-black text-lg">
            <div className="w-full h-full text-center col-start-2 col-end-3">
              1診
            </div>
            <div className="w-full h-full text-center">2診</div>
            <div className="w-full h-full text-center">3診</div>
            <div className="flex justify-center items-center w-full h-full row-start-2 row-end-2">
              早
            </div>
            <div className="flex justify-center items-center w-full h-full row-start-3 row-end-4">
              午
            </div>
            <div className="flex justify-center items-center w-full h-full row-start-4 row-end-5">
              晚
            </div>
            <div className="col-start-2 col-end-5 row-start-2 row-end-5 grid grid-cols-3 grid-rows-3 gap-1 p-1 bg-bg-gray rounded">
              <ShiftFrame />
            </div>
          </div>
          <p className="text-end text-sm text-gray-500">點擊格子編輯</p>
        </div>
      )}
    </>
  );
};

const ShiftFrame = ({ props }) => {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div
      className="w-full h-full p-1 bg-white rounded text-base cursor-pointer"
      onClick={() => setIsEditing(true)}
    >
      {!isEditing && <div className="">醫師: 王豬皮</div>}
      {!isEditing && <div className="">最多可約診人數: 6</div>}
      {isEditing && (
        <div className="flex flex-row">
          <p className="">醫師:</p>
          <select name="" id="" className="bg-bg-gray rounded">
            <option value="">王豬皮</option>
            <option value="">陳花乾</option>
            <option value="">許嘟嘟</option>
            <option value="">休診</option>
          </select>
        </div>
      )}
    </div>
  );
}

export { Doctors, Schedule };
