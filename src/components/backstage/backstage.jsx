import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, off, update, remove, push } from "firebase/database";

const week = ["mon", "tue", "wed", "thu", "fri", "sat"];
const weekCh = ["一", "二", "三", "四", "五", "六"]

const EditInput = ({ editDoctor, handleNameChange, handleShiftChange, handleSave, handleCancel }) => {
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
}

const Doctors = () => {
  const [editDoctor, setEditDoctor] = useState({
    name: '',
    work: {
      mon: null,
      tue: null,
      wed: null,
      thu: null,
      fri: null,
      sat: null,
    }
  })
  const [doctorList, setDoctorList] = useState([])
  const [newDoctor, setNewDoctor] = useState(false)
  const [editing, setEditing] = useState(false)

  const db = getDatabase()

  useEffect(() => {
    const doctorRef = ref(db, "doctors")
    onValue(doctorRef, (snap) => {
      if (snap.exists()) {
        const list = snap.val()
        const docData = []
        for (const [key, value] of Object.entries(list)) {
          docData.push({
            ...value,
            id: key
          })
        }
        setDoctorList(docData)
      }
    })

    return () => {
      off(doctorRef)
    }
    // eslint-disable-next-line
  }, [])

  const handleNameChange = (value) => {
    setEditDoctor((prev) => ({
      ...prev,
      name: value,
    }));
  }

  const handleShiftChange = (day, shift) => {
    setEditDoctor((prev) => ({
      ...prev,
      work: {
        ...prev.work,
        [day]: shift,
      }
    }));
  };

  const handleNewDoctor = () => {
    setNewDoctor(true)
  }

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
    })
    setNewDoctor(false)
    setEditing(false)
  }

  const handleSaveNewDoctor = async () => {
    if (!editDoctor?.name?.length) {
      alert("請輸入醫師姓名");
      return
    }

    const docRef = ref(db, "doctors")
    try {
      await push(docRef, editDoctor);
    } catch (error) {
      console.log(error)
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
    })
    setNewDoctor(false)
  }

  const handleDeleteDoctor = (docId, docName) => {
    const resulf = confirm(`刪除 ${docName} 的資料?`);
    if (resulf) remove(ref(db, "doctors/" + docId))
    else return
  }

  const handleEditDoctor = (doc) => {
    setEditDoctor(doc);
    setEditing(true)
  }

  const handleSaveEditDoctor = async () => {
    const { id, ...docData } = editDoctor

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
    setEditing(false)
  }

  console.log(editDoctor)

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
          doctorList.map((doc) => {
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
          <button
            className="w-fit mx-auto mt-4 px-8 py-4 border border-icon-orange border-solid rounded-full bg-icon-orange text-white hover:bg-white hover:text-icon-orange"
            onClick={handleNewDoctor}
          >
            新增醫師
          </button>
        )}
      </div>
    </div>
  );
}

export { Doctors };