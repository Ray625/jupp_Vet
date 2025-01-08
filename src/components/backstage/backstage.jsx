import { useEffect, useState } from "react";
import { getDatabase, ref, update, remove, push } from "firebase/database";
import moment from "moment";
import { useOutletContext } from "react-router-dom";
import useThrottle from "../../hooks/useThrottle";
import { OneBtnAlert } from "../alert/alert";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

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
                value="休"
                className="w-4 h-4 cursor-pointer"
                checked={editDoctor.work[day] === "休"}
                onChange={(e) => handleShiftChange(day, e.target.value)}
              />
            </div>
          );
        })}
      </div>
      <button
        className="flex justify-start items-center w-3.5 hover:opacity-80 transition-all duration-200"
        onClick={handleSave}
      >
        <i className="fa-solid fa-check text-center"></i>
      </button>
      <button
        className="flex justify-start items-center w-3.5 hover:opacity-80 transition-all duration-200"
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
      className="w-fit mx-auto px-8 py-4 border border-icon-orange border-solid rounded-full bg-icon-orange text-white hover:bg-white hover:text-icon-orange shadow transition-all duration-200 ease-out"
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
      mon: "",
      tue: "",
      wed: "",
      thu: "",
      fri: "",
      sat: "",
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
        mon: "",
        tue: "",
        wed: "",
        thu: "",
        fri: "",
        sat: "",
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
        mon: "",
        tue: "",
        wed: "",
        thu: "",
        fri: "",
        sat: "",
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
        mon: "",
        tue: "",
        wed: "",
        thu: "",
        fri: "",
        sat: "",
      },
    });
    setEditing(false);
  };

  return (
    <div className="flex flex-col mx-auto xl:pt-8 pb-8 h-fit lg:w-8/12 md:w-fit">
      <div className="flex flex-col px-4 py-8 gap-4 lg:w-full md:w-fit bg-white rounded-lg shadow-lg">
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
                className="flex flex-row gap-4 p-4 lg:w-full md:w-fit bg-bg-gray rounded-lg"
                key={doc.name}
              >
                <p className="font-normal lg:w-20 md:w-fit text-nowrap">
                  {doc.name}
                </p>
                <p className="font-normal flex-grow text-center text-nowrap">
                  {`${work.mon ? `週一(${work.mon})` : ""}`}{" "}
                  {`${work.tue ? `週二(${work.tue})` : ""}`}{" "}
                  {`${work.wed ? `週三(${work.wed})` : ""}`}{" "}
                  {`${work.thu ? `週四(${work.thu})` : ""}`}{" "}
                  {`${work.fri ? `週五(${work.fri})` : ""}`}{" "}
                  {`${work.sat ? `週六(${work.sat})` : ""}`}
                </p>
                <button
                  className="hover:opacity-80 transition-all duration-200"
                  onClick={() => handleEditDoctor(doc)}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  className="hover:opacity-80 transition-all duration-200"
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

const MonthSchedule = () => {
  const {
    schedule,
    selectMonth,
    setSelectMonth,
    prevMonthSchedule,
    nextMonthSchedule,
  } = useOutletContext();
  const [newSchedule, setNewSchedule] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState("");

  useEffect(() => {
    setNewSchedule(schedule);
  }, [schedule]);

  const firstDayOfWeek = moment(`${selectMonth}-01`).format("d");
  const lastDayOfWeek = moment(`${selectMonth}-01`)
    .add(1, "month")
    .subtract(1, "days")
    .format("d");

  // 月曆佔未符，前面格數
  const placeholderArrayBefore = Array.from(
    { length: Number(firstDayOfWeek) },
    (_, i) => (
      <div
        className="xl:w-32 xl:h-32 lg:w-28 lg:h-28 w-24 h-24 rounded bg-white"
        key={`empty-${i}`}
      ></div>
    )
  );

  // 月曆佔未符，後面格數
  const placeholderArrayAfter = Array.from(
    { length: 6 - Number(lastDayOfWeek) },
    (_, i) => (
      <div
        className="xl:w-32 xl:h-32 lg:w-28 lg:h-28 w-24 h-24 rounded bg-white"
        key={`empty-${i}`}
      ></div>
    )
  );

  const handleSubtractSelectMonth = () => {
    setNewSchedule(prevMonthSchedule);
    setSelectMonth((prev) => {
      const newMonth = moment(prev).subtract(1, "M").format("YYYY-MM");
      return newMonth;
    });
  };

  const throttleSubtractSelect = useThrottle(handleSubtractSelectMonth, 300);

  const handleAddSelectMonth = () => {
    setNewSchedule(nextMonthSchedule);
    setSelectMonth((prev) => {
      const newMonth = moment(prev).add(1, "M").format("YYYY-MM");
      return newMonth;
    });
  };

  const throttleAddSelect = useThrottle(handleAddSelectMonth, 300);

  const handleUpdateSchedule = async () => {
    const db = getDatabase();

    const scheduleRef = ref(db, "schedule");
    try {
      await update(scheduleRef, newSchedule);
      setAlertText("資料已更新");
      setAlertOpen(true);
    } catch (error) {
      setAlertText(`資料上傳失敗：${error}`);
      setAlertOpen(true);
    }
  };

  return (
    <div className="relative">
      {alertOpen && (
        <OneBtnAlert
          title={alertText}
          button={"確認"}
          handleClose={() => setAlertOpen(false)}
          handleConfirm={() => setAlertOpen(false)}
        />
      )}
      <div className="w-full">
        <div className="flex flex-row justify-between items-center mx-auto w-52 mb-2">
          <button
            className="hover:opacity-80 transition-all duration-200"
            onClick={throttleSubtractSelect}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div className="font-medium text-2xl">{`${selectMonth}月`}</div>
          <button
            className="hover:opacity-80 transition-all duration-200"
            onClick={throttleAddSelect}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
      {Object.keys(newSchedule).length === 0 && (
        <div className="w-full mt-6 text-center text-xl text-gray-700">
          當月資料尚未上傳至資料庫，請先至上方「批次產生班表」執行操作
        </div>
      )}
      {Object.keys(newSchedule).length !== 0 && (
        <div className="w-fit h-fit">
          <div className="w-fit h-fit mt-1 p-1 bg-bg-gray rounded">
            <div className="flex flex-row w-fit gap-1 bg-white rounded mb-1">
              <div className="flex items-center justify-center xl:w-32 lg:w-28 w-24 h-8">
                日
              </div>
              <div className="flex items-center justify-center xl:w-32 lg:w-28 w-24 h-8">
                一
              </div>
              <div className="flex items-center justify-center xl:w-32 lg:w-28 w-24 h-8">
                二
              </div>
              <div className="flex items-center justify-center xl:w-32 lg:w-28 w-24 h-8">
                三
              </div>
              <div className="flex items-center justify-center xl:w-32 lg:w-28 w-24 h-8">
                四
              </div>
              <div className="flex items-center justify-center xl:w-32 lg:w-28 w-24 h-8">
                五
              </div>
              <div className="flex items-center justify-center xl:w-32 lg:w-28 w-24 h-8">
                六
              </div>
            </div>
            <div className="grid grid-cols-7 auto-rows-min gap-1 w-fit h-fit">
              {placeholderArrayBefore}
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
              {placeholderArrayAfter}
            </div>
            <div className="bg-white mt-1 p-1 rounded">
              <p className="w-full pr-1 text-end text-sm text-gray-700">
                點選格子可逐日編輯，編輯後按下更新班表，資料才會確實上傳
              </p>
              <div className="flex justify-center w-full mb-2">
                <NewBtn onClick={handleUpdateSchedule} text="更新班表" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PreviewSchedule = ({ newSchedule, setNewSchedule, emptyBox }) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState("");
  const db = getDatabase();

  // 月曆佔未符，前面格數
  const placeholderArrayBefore = Array.from(
    { length: Number(emptyBox[0]) },
    (_, i) => (
      <div className="xl:w-32 xl:h-32 lg:w-28 lg:h-28 w-24 h-24 rounded bg-white" key={`empty-${i}`}></div>
    )
  );

  // 月曆佔未符，後面格數
  const placeholderArrayAfter = Array.from(
    { length: 6 - Number(emptyBox[1]) },
    (_, i) => (
      <div
        className="xl:w-32 xl:h-32 lg:w-28 lg:h-28 w-24 h-24 rounded bg-white"
        key={`empty-${i}`}
      ></div>
    )
  );

  const handleNewSchedule = async ({ e, newSchedule }) => {
    e.stopPropagation();
    const scheduleRef = ref(db, "schedule");
    try {
      await update(scheduleRef, newSchedule);
      setAlertText("上傳成功");
      setAlertOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {alertOpen && (
        <OneBtnAlert
          title={alertText}
          button={"確認"}
          handleClose={() => setAlertOpen(false)}
          handleConfirm={() => setAlertOpen(false)}
        />
      )}
      {Object.keys(newSchedule).length !== 0 && (
        <div className="relative w-fit h-fit mt-1 p-1 bg-bg-gray rounded">
          <div className="flex flex-row w-fit gap-1 bg-white rounded mb-1">
            <div className="flex items-center justify-center xl:w-32 lg:w-28 w-24 h-8">日</div>
            <div className="flex items-center justify-center xl:w-32 lg:w-28 w-24 h-8">一</div>
            <div className="flex items-center justify-center xl:w-32 lg:w-28 w-24 h-8">二</div>
            <div className="flex items-center justify-center xl:w-32 lg:w-28 w-24 h-8">三</div>
            <div className="flex items-center justify-center xl:w-32 lg:w-28 w-24 h-8">四</div>
            <div className="flex items-center justify-center xl:w-32 lg:w-28 w-24 h-8">五</div>
            <div className="flex items-center justify-center xl:w-32 lg:w-28 w-24 h-8">六</div>
          </div>
          <div className="grid grid-cols-7 auto-rows-min gap-1 w-fit h-fit">
            {placeholderArrayBefore}
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
            {placeholderArrayAfter}
          </div>
          <div className="bg-white mt-1 p-1 rounded">
            <p className="w-full pr-1 text-end text-sm text-gray-700">
              此處僅為預覽，點選格子可逐日編輯，按下新增將資料上傳
            </p>
            <div className="flex justify-center w-full mb-2">
              <NewBtn
                onClick={(e) => handleNewSchedule({ e, newSchedule })}
                text="新增班表"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DayFrame = ({ time, data, setNewSchedule }) => {
  const [enlarge, setEnlarge] = useState(false);
  const date = moment(time).format("D");
  const month = moment(time).format("YYYY / M");
  const day = "日一二三四五六"[moment(time).format("d")];
  const { r1s1, r1s2, r1s3, r2s1, r2s2, r2s3, r3s1, r3s2, r3s3 } = data;
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState("");

  const handleSaveDaySchedule = (e) => {
    e.stopPropagation();

    const isSameDoctor = (s1, s2) => {
      return s1?.name && s2?.name && s1.name === s2.name;
    };

    // 檢查每個時段是否有相同醫生，避免手動填入產生錯誤
    if (
      isSameDoctor(r1s1, r2s1) ||
      isSameDoctor(r1s1, r3s1) ||
      isSameDoctor(r2s1, r3s1) ||
      isSameDoctor(r1s2, r2s2) ||
      isSameDoctor(r1s2, r3s2) ||
      isSameDoctor(r2s2, r3s2) ||
      isSameDoctor(r1s3, r2s3) ||
      isSameDoctor(r1s3, r3s3) ||
      isSameDoctor(r2s3, r3s3)
    ) {
      setAlertText("同一時段不同診間，不可為同一醫師");
      setAlertOpen(true);
      return;
    }

    setEnlarge(false);
  };

  const initialsName = (data) => {
    if (!data) {
      return "";
    } else {
      return `${data.name[0]} `;
    }
  };

  return (
    <>
      {alertOpen && (
        <OneBtnAlert
          title={alertText}
          button={"確認"}
          handleClose={() => setAlertOpen(false)}
          handleConfirm={() => setAlertOpen(false)}
        />
      )}
      <div
        className="relative flex flex-col bg-white xl:w-32 xl:h-32 lg:w-28 lg:h-28 w-24 h-24 p-2 xl:text-lg lg:text-base text-sm rounded hover:opacity-80 cursor-pointer transition-all duration-200"
        onClick={() => setEnlarge(true)}
      >
        <div className="text-right">{date}</div>
        {!(
          r1s1?.name ||
          r1s2?.name ||
          r1s3?.name ||
          r2s1?.name ||
          r2s2?.name ||
          r2s3?.name ||
          r3s1?.name ||
          r3s2?.name ||
          r3s3?.name
        ) && (
          <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full ">
            休
          </div>
        )}
        {(r1s1?.name || r2s1?.name || r3s1?.name) && (
          <div className="">{`早：${initialsName(r1s1)}${initialsName(
            r2s1
          )}${initialsName(r3s1)}`}</div>
        )}
        {(r1s2?.name || r2s2?.name || r3s2?.name) && (
          <div className="">{`午：${initialsName(r1s2)}${initialsName(
            r2s2
          )}${initialsName(r3s2)}`}</div>
        )}
        {(r1s3?.name || r2s3?.name || r3s3?.name) && (
          <div className="">{`晚：${initialsName(r1s3)}${initialsName(
            r2s3
          )}${initialsName(r3s3)}`}</div>
        )}
      </div>
      {enlarge && (
        <div className="flex flex-col w-full h-full py-6 px-4 bg-white absolute top-0 left-0 rounded z-10">
          <div className="flex flex-row justify-between items-center">
            <button
              className="flex justify-center items-center w-8 p-2 rounded hover:opacity-80 transition-all duration-200"
              onClick={handleSaveDaySchedule}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div className={"flex w-full justify-end text-xl"}>
              <div className="font-medium">{`${month} / ${date} (${day})`}</div>
            </div>
          </div>
          <div className="grid grid-cols-[48px_repeat(3,_minmax(0,_1fr))] grid-rows-[48px_repeat(3,_minmax(0,_1fr))] w-full h-full mt-2 py-2 border-t border-solid border-black text-lg">
            <div className="flex justify-center items-center w-full h-full col-start-2 col-end-3">
              1診
            </div>
            <div className="flex justify-center items-center w-full h-full">
              2診
            </div>
            <div className="flex justify-center items-center w-full h-full">
              3診
            </div>
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
              <ShiftFrame
                data={r1s1}
                setNewSchedule={setNewSchedule}
                time={time}
                shift={"r1s1"}
              />
              <ShiftFrame
                data={r2s1}
                setNewSchedule={setNewSchedule}
                time={time}
                shift={"r2s1"}
              />
              <ShiftFrame
                data={r3s1}
                setNewSchedule={setNewSchedule}
                time={time}
                shift={"r3s1"}
              />
              <ShiftFrame
                data={r1s2}
                setNewSchedule={setNewSchedule}
                time={time}
                shift={"r1s2"}
              />
              <ShiftFrame
                data={r2s2}
                setNewSchedule={setNewSchedule}
                time={time}
                shift={"r2s2"}
              />
              <ShiftFrame
                data={r3s2}
                setNewSchedule={setNewSchedule}
                time={time}
                shift={"r3s2"}
              />
              <ShiftFrame
                data={r1s3}
                setNewSchedule={setNewSchedule}
                time={time}
                shift={"r1s3"}
              />
              <ShiftFrame
                data={r2s3}
                setNewSchedule={setNewSchedule}
                time={time}
                shift={"r2s3"}
              />
              <ShiftFrame
                data={r3s3}
                setNewSchedule={setNewSchedule}
                time={time}
                shift={"r3s3"}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ShiftFrame = ({ data = null, time, shift, setNewSchedule }) => {
  const { doctorsList } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState("");

  const handleNameSelectChange = (e) => {
    const value = e.target.value;
    setNewSchedule((prev) => {
      return {
        ...prev,
        [time]: {
          ...prev[time],
          [shift]: {
            ...prev[time][shift],
            name: value,
          },
        },
      };
    });
  };

  const handleNumInputChange = (e) => {
    const value = e.target.value;
    setNewSchedule((prev) => {
      return {
        ...prev,
        [time]: {
          ...prev[time],
          [shift]: {
            ...prev[time][shift],
            maxAppointments: value,
          },
        },
      };
    });
  };

  const handleShiftDelete = () => {
    setNewSchedule((prev) => {
      const newData = { ...prev };
      delete newData[time][shift];
      return newData;
    });
  };

  const handleNewNameInputChange = (e) => {
    const value = e.target.value;
    setNewSchedule((prev) => {
      return {
        ...prev,
        [time]: {
          ...prev[time],
          [shift]: {
            ...prev[time][shift],
            name: value,
            currentAppointments: 0,
            room: `${shift[1]}診`,
            shift: `shift${shift[3]}`,
          },
        },
      };
    });
  };

  const handleSaveNewShift = () => {
    if (!data) {
      setAlertText("請選擇值班醫師");
      setAlertOpen(true);
      return;
    }

    if (!data.maxAppointments) {
      setAlertText("請填選最大門診數");
      setAlertOpen(true);
      return;
    }

    setIsAdding(false);
  };

  const handleCancelNewShift = () => {
    setNewSchedule((prev) => {
      const newData = { ...prev };
      delete newData[time][shift];
      return newData;
    });

    setIsAdding(false);
  };

  return (
    <>
      {alertOpen && (
        <OneBtnAlert
          title={alertText}
          button={"確認"}
          handleClose={() => setAlertOpen(false)}
          handleConfirm={() => setAlertOpen(false)}
        />
      )}
      <div className={`relative w-full h-full p-2 bg-white rounded text-base}`}>
        {!isEditing && !data?.name && !isAdding && (
          <div className="relative w-full h-full">
            <p className="absolute text-gray-500">休診</p>
            <button
              className="flex justify-center items-center w-full h-full opacity-0 hover:opacity-80 transition-all duration-200"
              onClick={() => setIsAdding(true)}
            >
              <i className="fa-solid fa-plus fa-lg"></i>
            </button>
          </div>
        )}
        {!isEditing && !isAdding && data?.name && (
          <div>{`醫師: ${data?.name}`}</div>
        )}
        {!isEditing && !isAdding && data?.maxAppointments && (
          <div className="mt-1">{`可約診人數: ${data?.maxAppointments}`}</div>
        )}
        {!isEditing && !isAdding && data?.name && (
          <div className="absolute bottom-0 left-0 flex flex-row justify-end w-full pr-2">
            <button
              className="hover:opacity-80 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
            <button
              className="hover:opacity-80 ml-2 transition-all duration-200"
              onClick={handleShiftDelete}
            >
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        )}
        {isEditing && (
          <div className="flex flex-row">
            <p>醫師:</p>
            <select
              name="name"
              className="ml-1 bg-bg-gray rounded"
              value={data?.name}
              onChange={handleNameSelectChange}
            >
              {doctorsList.map((doc) => (
                <option value={doc.name} key={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {isEditing && (
          <div className="flex flex-row items-center mt-1">
            <p>可約診人數:</p>
            <input
              type="number"
              max="20"
              min="0"
              value={data?.maxAppointments}
              className="w-10 h-6 ml-1 pl-1 bg-bg-gray rounded"
              onChange={handleNumInputChange}
              required
            />
          </div>
        )}
        {isEditing && (
          <div className="absolute bottom-0 left-0 flex flex-row justify-end w-full pr-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(false);
              }}
            >
              <i className="fa-solid fa-check"></i>
            </button>
          </div>
        )}
        {isAdding && (
          <div className="flex flex-row">
            <p>醫師:</p>
            <select
              name="name"
              className="ml-1 bg-bg-gray rounded"
              value={data?.name}
              onChange={handleNewNameInputChange}
            >
              <option value="">請選擇</option>
              {doctorsList.map((doc) => (
                <option value={doc.name} key={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {isAdding && data && (
          <div className="flex flex-row items-center mt-1">
            <p>可約診人數:</p>
            <input
              type="number"
              max="20"
              min="0"
              value={data?.maxAppointments}
              className="w-10 h-6 ml-1 pl-1 bg-bg-gray rounded"
              onChange={handleNumInputChange}
              required
            />
          </div>
        )}
        {isAdding && (
          <div className="absolute bottom-0 left-0 flex flex-row justify-end gap-2 w-full pr-2">
            <button
              className="hover:opacity-80 transition-all duration-200"
              onClick={handleSaveNewShift}
            >
              <i className="fa-solid fa-check"></i>
            </button>
            <button
              className="hover:opacity-80 transition-all duration-200"
              onClick={handleCancelNewShift}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const Schedule = () => {
  const { doctorsList } = useOutletContext();
  const [newSchedule, setNewSchedule] = useState({});
  const [emptyBox, setEmptyBox] = useState([]);
  const [action, setAction] = useState("view");
  const monthOption = [];

  for (let i = 0; i <= 3; i++) {
    const data = moment().add(i, "months").format("YYYY-MM");
    monthOption.push(
      <option value={data} key={data}>
        {data}月
      </option>
    );
  }

  // 依照醫師名單之設定產生單日班表
  const handleGetDateSchedule = (time) => {
    const day = moment(time).format("ddd").toLowerCase();
    const date = moment(time).format("YYYY-MM-DD");
    const month = moment(time).format("YYYY-MM");

    const schedule = {};

    for (let [index, item] of doctorsList.entries()) {
      if (!item.work[day]) continue;

      const room = index + 1;

      const shifts = item.work[day] === "早" ? ["s1", "s2"] : ["s2", "s3"];

      shifts.forEach((shift) => {
        schedule[`r${room}${shift}`] = {
          name: item.name,
          room: `${room}診`,
          shift: `shift${shift[1]}`,
          currentAppointments: 0,
          maxAppointments: 6,
        };
      });
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
    const firstDayOfWeek = moment(`${time}-01`).format("d");
    const lastDayOfWeek = moment(`${time}-01`)
      .add(1, "month")
      .subtract(1, "days")
      .format("d");
    const dayOfWeek = [firstDayOfWeek, lastDayOfWeek];

    const list = {};
    for (let i = 1; i <= Number(monthLastDay); i++) {
      const day = moment(`${time}-${i}`).format("YYYY-MM-DD");
      const { updates } = handleGetDateSchedule(day);
      list[day] = updates[day];
    }

    return { list, dayOfWeek };
  };

  const handleTimeSelect = (e) => {
    const time = e.target.value;
    if (time === "none") {
      setNewSchedule({});
      return;
    } else {
      const { list, dayOfWeek } = handleNewOneMonthSchedule(time);
      setNewSchedule(list);
      setEmptyBox(dayOfWeek);
    }
  };

  return (
    <div className="flex flex-col mx-auto xl:pt-8 pb-8 xl:w-[960px] lg:w-[832px] md:w-[720px] w-fit h-full">
      <div className="w-fit">
        <div className="flex flex-row w-full">
          <button
            className={`${action === "view" ? "bg-white" : ""} p-3 rounded-t`}
            onClick={() => {
              setAction("view");
              setNewSchedule({});
            }}
          >
            <h3
              className={`${
                action === "view" ? " font-medium" : "font-light "
              } text-2xl text-black`}
            >
              檢視與編輯
            </h3>
          </button>
          <button
            className={`${action === "build" ? "bg-white" : ""} p-3 rounded-t`}
            onClick={() => setAction("build")}
          >
            <h3
              className={`${
                action === "build" ? "font-medium" : "font-light "
              } text-2xl text-black`}
            >
              批次產生班表
            </h3>
          </button>
        </div>
      </div>
      <div
        className={`bg-white w-fit p-2 xl:p-4 rounded-b-md ${
          action === "view" ? "rounded-tr-md" : "rounded-t-md"
        } `}
      >
        {action === "view" && (
          <div className="w-fit">
            <MonthSchedule />
          </div>
        )}
        {action === "build" && (
          <div>
            <div className="flex flex-row items-center">
              <p className="">將次月班表新增至資料庫，供使用者約診。 月份：</p>
              <select
                name="time"
                id="time"
                className="bg-bg-gray p-2 w-fit h-8px-1 rounded"
                onChange={handleTimeSelect}
              >
                <option value={"none"}>請選擇</option>
                {monthOption}
              </select>
            </div>
            <PreviewSchedule
              newSchedule={newSchedule}
              setNewSchedule={setNewSchedule}
              emptyBox={emptyBox}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const Paginator = ({
  totalPage,
  currentPage,
  handleChangePage,
  handleKeyDown,
  handleOnBlur,
  handlePrevPage,
  handleNextPage,
}) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPage;

  return (
    <div className="flex flex-row w-full mt-auto justify-between items-center">
      <div className="flex flex-row gap-2 items-center">
        <input
          type="text"
          value={currentPage}
          className="w-6 px-1 rounded border border-black bg-white text-black text-center"
          onChange={(e) => handleChangePage(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleOnBlur}
          name="currentPage"
        />
        <p>{`/ ${totalPage}`}</p>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <button
          className={`w-12 rounded border text-lg text-center ${
            isFirstPage
              ? "border-disabled-gray text-disabled-gray"
              : " border-footer-blue text-footer-blue hover:text-white hover:bg-footer-blue transition-all duration-200"
          }`}
          onClick={handlePrevPage}
          disabled={isFirstPage}
        >{`<`}</button>
        <button
          className={`w-12 rounded border text-lg text-center ${
            isLastPage
              ? "border-disabled-gray text-disabled-gray"
              : " border-footer-blue text-footer-blue hover:text-white hover:bg-footer-blue transition-all duration-200"
          }`}
          onClick={handleNextPage}
          disabled={isLastPage}
        >{`>`}</button>
      </div>
    </div>
  );
};

const Records = () => {
  const { recordsData, doctorsList, filters, setFilters } = useOutletContext();
  const [records, setRecords] = useState(null);
  const [paginator, setPaginator] = useState({
    totalPage: null,
    currentPage: 1,
    inputValue: 1,
  });

  useEffect(() => {
    const totalPage = Math.ceil(recordsData.length / 14);
    setPaginator((prev) => {
      return {
        ...prev,
        totalPage: totalPage,
      };
    });
  }, [recordsData]);

  useEffect(() => {
    if (paginator.currentPage) {
      const startItems = 0 + (paginator.currentPage - 1) * 14;
      const endItems = 14 + (paginator.currentPage - 1) * 14;

      const currentPageData = recordsData.slice(startItems, endItems);

      setRecords(currentPageData);
    }
  }, [paginator.currentPage, recordsData]);

  const handlefilterDoctor = (e) => {
    setFilters((prev) => {
      return {
        ...prev,
        doctor: e.target.value,
      };
    });
  };

  const handleClear = () => {
    setFilters({
      startDate: null,
      endDate: null,
      doctor: "all",
      keywords: "",
    });
  };

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
    setPaginator((prev) => {
      return {
        ...prev,
        currentPage: Number(prev.currentPage) + page,
        inputValue: Number(prev.currentPage) + page,
      };
    });
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

  return (
    <div className="flex flex-col mx-auto xl:pt-8 pb-8 w-fit h-full">
      <div className="flex flex-col h-full p-3 bg-white rounded overflow-x-hidden ">
        <div className="flex flex-row justify-between items-center">
          <h3 className="my-2 font-medium xl:text-2xl lg:text-xl text-base">
            約診紀錄
          </h3>
          <search className="flex flex-row gap-2">
            <div className="flex flex-row gap-2 items-center justify-center w-fit rounded">
              <label className="w-fit" htmlFor="startTime">
                區間
              </label>
              <div>
                <DatePicker
                  selected={filters.startDate}
                  onChange={(date) =>
                    setFilters((prev) => {
                      const day = moment(new Date(date)).format("YYYY-MM-DD");
                      return {
                        ...prev,
                        startDate: day,
                      };
                    })
                  }
                  selectsStart
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  placeholderText="開始時間"
                  dateFormat="yyyy-MM-dd"
                  className="m-0 px-2 py-1 w-28 rounded bg-white border border-black"
                  id="startTime"
                />
              </div>
              <div>
                <DatePicker
                  selected={filters.endDate}
                  onChange={(date) =>
                    setFilters((prev) => {
                      const day = moment(new Date(date)).format("YYYY-MM-DD");
                      return {
                        ...prev,
                        endDate: day,
                      };
                    })
                  }
                  selectsEnd
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  minDate={filters.startDate}
                  placeholderText="結束時間"
                  dateFormat="yyyy-MM-dd"
                  className="m-0 px-2 py-1 w-28 rounded bg-white border border-black"
                  id="endTime"
                />
              </div>
            </div>
            <select
              className="px-2 border border-black rounded"
              value={filters.doctor}
              onChange={handlefilterDoctor}
              name="doctorFilter"
            >
              <option value="all">所有醫師</option>
              {doctorsList.map((doctor) => (
                <option
                  value={doctor.name}
                  key={doctor.id}
                >{`${doctor.name} 醫師`}</option>
              ))}
            </select>
            <input
              type="text"
              className="w-64 py-1 px-2 border border-gray-800 rounded focus:border-black"
              placeholder="姓名、電話、Email、寵物名稱"
              name="filter"
              value={filters.keywords}
              onChange={(e) => {
                setFilters((prev) => {
                  return {
                    ...prev,
                    keywords: e.target.value,
                  };
                });
              }}
            />
            <button
              className="px-2 bg-footer-blue text-white border border-footer-blue rounded hover:opacity-80 transition-all duration-200"
              onClick={handleClear}
            >
              清除條件
            </button>
          </search>
        </div>
        <table className="w-fit my-2 bg-white rounded table-fixed xl:text-xl lg:text-lg text-base">
          <thead>
            <tr>
              <th className="px-2 py-1 w-36 border-4 border-bg-gray text-left font-normal">
                日期
              </th>
              <th className="px-2 py-1 w-16 border-4 border-bg-gray text-left font-normal">
                診間
              </th>
              <th className="px-2 py-1 w-16 border-4 border-bg-gray text-left font-normal">
                號碼
              </th>
              <th className="px-2 py-1 w-28 border-4 border-bg-gray text-left font-normal">
                飼主姓名
              </th>
              <th className="px-2 py-1 w-36 border-4 border-bg-gray text-left font-normal">
                電話
              </th>
              <th className="px-2 py-1 xl:w-48 w-36 border-4 border-bg-gray text-left font-normal">
                Email
              </th>
              <th className="px-2 py-1 w-28 border-4 border-bg-gray text-left font-normal">
                寵物
              </th>
              <th className="px-2 py-1 w-28 border-4 border-bg-gray text-left font-normal">
                醫師
              </th>
              <th className="px-2 py-1 w-20 border-4 border-bg-gray text-left font-normal">
                備註
              </th>
            </tr>
          </thead>
          <tbody>
            {records &&
              records.map((record) => (
                <tr key={record.id} className="xl:text-xl lg:text-lg text-base">
                  <td className="px-2 py-1 w-36 border-4 border-bg-gray text-left font-normal">
                    {record.date_key.slice(0, -5)}
                  </td>
                  <td className="px-2 py-1 w-16 border-4 border-bg-gray text-left font-normal">
                    {record.date_key.slice(-3, -2)}
                  </td>
                  <td className="px-2 py-1 w-16 border-4 border-bg-gray text-left font-normal">
                    {record.number}
                  </td>
                  <td
                    className="px-2 py-1 w-28 border-4 border-bg-gray text-left font-normal truncate"
                    title={`${record.owner.lastName + record.owner.firstName}`}
                  >
                    {`${record.owner.lastName + record.owner.firstName}`}
                  </td>
                  <td className="px-2 py-1 w-36 border-4 border-bg-gray text-left font-normal">
                    {record.owner.phone}
                  </td>
                  <td
                    className="px-2 py-1 xl:w-48 w-36 border-4 border-bg-gray text-left font-normal truncate"
                    title={record.owner.email}
                  >
                    {record.owner.email}
                  </td>
                  <td
                    className="px-2 py-1 w-28 border-4 border-bg-gray text-left font-normal truncate"
                    title={record.pet_name}
                  >
                    {record.pet_name}
                  </td>
                  <td className="px-2 py-1 w-28 border-4 border-bg-gray text-left font-normal">
                    {record.doctor.slice(0, -7)}
                  </td>
                  <td className="px-2 py-1 w-20 border-4 border-bg-gray text-left font-normal">
                    {record.isCanceled ? "已取消" : ""}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Paginator
          currentPage={paginator.inputValue}
          totalPage={paginator.totalPage}
          handleChangePage={handleChangePage}
          handleKeyDown={handleKeyDown}
          handleOnBlur={handleOnBlur}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
        />
      </div>
    </div>
  );
};

const PetsInfo = ({ pets, setPetsInfoOpen, setPets }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 flex w-full h-full justify-center items-center bg-[rgba(0,0,0,0.5)]">
      <div className="relative p-6 border rounded-xl bg-white">
        <button
          className="absolute top-8 right-8"
          onClick={() => {
            setPetsInfoOpen(false);
            setPets({});
          }}
        >
          <i className="fa-solid fa-xmark fa-xl"></i>
        </button>
        <h3 className="font-medium text-2xl">寵物列表</h3>
        <div className="flex flex-col gap-2 w-fit min-w-[486px] h-fit mt-4">
          {pets &&
            Object.values(pets).map((pet, index) => {
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

              return (
                <div
                  className="flex flex-row gap-2 p-2 border rounded text-lg"
                  key={pet.petName}
                >
                  <div className="mr-4">寵物{index + 1}</div>
                  <div>{pet.petName}</div>
                  <img src={speciesIcon} alt="icon" />
                  <div className="text-disabled-gray">
                    ( {gender}・{age}歲・{pet.breed} )
                  </div>
                  {pet.isDeleted && <div>(已刪除)</div>}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

const Users = () => {
  const { usersData, userFilters, setUserFilters } = useOutletContext();
  const [users, setUsers] = useState(usersData);
  const [paginator, setPaginator] = useState({
    totalPage: null,
    currentPage: 1,
    inputValue: 1,
  });

  const [pets, setPets] = useState({})
  const [petsInfoOpen, setPetsInfoOpen] = useState(false)

  useEffect(() => {
    const totalPage = Math.ceil(usersData.length / 14)
    setPaginator((prev) => {
      return {
        ...prev,
        totalPage,
      }
    })
  }, [usersData])

  useEffect(() => {
    if (paginator.currentPage) {
      const startItems = 0 + (paginator.currentPage - 1) * 14;
      const endItems = 14 + (paginator.currentPage - 1) * 14;

      const currentPageData = usersData.slice(startItems, endItems);

      setUsers(currentPageData);
    }
  }, [paginator.currentPage, usersData]);

  const handleFilterChange = (e) => {
    setUserFilters(e.target.value);
  }

  const handleFilterClear = () => {
    setUserFilters("")
  }

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
    setPaginator((prev) => {
      return {
        ...prev,
        currentPage: Number(prev.currentPage) + page,
        inputValue: Number(prev.currentPage) + page,
      };
    });
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

  return (
    <div className="flex flex-col mx-auto xl:pt-8 pb-8 w-fit h-full">
      <div className="flex flex-col h-full p-3 bg-white rounded">
        <div className="flex flex-row justify-between items-center">
          <h3 className="my-2 font-medium text-2xl">使用者列表</h3>
          <search className="flex flex-row gap-2 justify-end h-fit">
            <input
              type="text"
              className="w-64 py-1 px-2 border border-gray-800 rounded focus:border-black"
              placeholder="姓名、電話、Email、寵物名稱"
              name="filter"
              value={userFilters}
              onChange={handleFilterChange}
            />
            <button
              className="px-2 bg-footer-blue text-white border border-footer-blue rounded hover:opacity-80 transition-all duration-200"
              onClick={handleFilterClear}
            >
              清除條件
            </button>
          </search>
        </div>
        <table className="w-fit my-2 bg-white rounded table-fixed xl:text-xl lg:text-lg text-base">
          <thead>
            <tr>
              <th className="px-2 py-1 w-40 border-4 border-bg-gray text-left font-normal">
                創建日期
              </th>
              <th className="px-2 py-1 w-32 border-4 w border-bg-gray text-left font-normal">
                姓名
              </th>
              <th className="px-2 py-1 w-36 border-4 border-bg-gray text-left font-normal">
                電話
              </th>
              <th className="px-2 py-1 w-64 border-4 border-bg-gray text-left font-normal">
                Email
              </th>
              <th className="px-2 py-1 w-20 border-4 border-bg-gray text-left font-normal">
                寵物
              </th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => {
                return (
                  <tr key={user.id} className="xl:text-xl lg:text-lg text-base">
                    <td className="px-2 py-1 w-40 border-4 border-bg-gray text-left font-normal">
                      {moment(user.createdAt).format("YYYY-MM-DD")}
                    </td>
                    <td
                      className="px-2 py-1 w-32 border-4 border-bg-gray text-left font-normal truncate"
                      title={`${user.lastName || ""}${user.firstName || ""}`}
                    >
                      {`${user.lastName || ""}${user.firstName || ""}`}
                    </td>
                    <td className="px-2 py-1 w-36 border-4 border-bg-gray text-left font-normal">
                      {user.phone}
                    </td>
                    <td
                      className="px-2 py-1 w-64 border-4 border-bg-gray text-left font-normal truncate"
                      title={user.email}
                    >
                      {user.email}
                    </td>
                    <td className="px-2 py-1 w-20 border-4 border-bg-gray text-center font-normal">
                      {user.pets && (
                        <button
                          className="w-fit min-w-8 border border-black rounded-full hover:text-white hover:bg-footer-blue transition-all duration-200"
                          name="Open Pets Info"
                          onClick={() => {
                            setPetsInfoOpen(true);
                            setPets(user.pets);
                          }}
                        >
                          {Object.values(user.pets)?.length}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {petsInfoOpen && (
          <PetsInfo
            pets={pets}
            setPets={setPets}
            setPetsInfoOpen={setPetsInfoOpen}
          />
        )}
        <Paginator
          currentPage={paginator.inputValue}
          totalPage={paginator.totalPage}
          handleChangePage={handleChangePage}
          handleKeyDown={handleKeyDown}
          handleOnBlur={handleOnBlur}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
        />
      </div>
    </div>
  );
};

export { Doctors, Schedule, Records, Users, Paginator };
