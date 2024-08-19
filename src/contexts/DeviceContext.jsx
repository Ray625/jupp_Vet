import { createContext, useEffect, useState } from "react";

// 透過Context讓compenet共用目前螢幕寬度資訊
const DeviceContext = createContext();

const DeviceProvider = ({ children }) => {
  const [device, setDevice] = useState('mobile');

  const handleRWD = () => {
    const device = {
      mobile: 0,
      tablet: 1,
      laptop: 2,
      pc: 3,
    }

    if (window.innerWidth >= 1440) {
      setDevice(device.pc)
    } else if (1440 > window.innerWidth && window.innerWidth >= 991) {
      setDevice(device.laptop)
    } else if (991 > window.innerWidth && window.innerWidth >= 768) {
      setDevice(device.tablet)
    } else {
      setDevice(device.mobile)
    }
  }

  useEffect(()=> {
    window.addEventListener('resize', handleRWD)
    handleRWD()

    return (()=> {
      window.removeEventListener('resize', handleRWD)
    })
  }, [])

  return (
    <DeviceContext.Provider value={device}>
      {children}
    </DeviceContext.Provider>
  )
}

export { DeviceContext, DeviceProvider }

