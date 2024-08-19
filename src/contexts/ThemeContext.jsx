import { createContext, useState, useEffect } from "react";
import { deviceParams } from "../utils/const";
import useDevice from '../hooks/useDevice'

const defaultThemeContext = {
  tickerOpen: null,
  setTickerOpen: () => {},
}

const ThemeContext = createContext(defaultThemeContext);

const ThemeProvider = ({ children }) => {
  const [tickerOpen, setTickerOpen] = useState(true);
  const device = useDevice()

  useEffect(() => {
    if (device === deviceParams.mobile) {
      setTickerOpen(false)
    } else if (device === deviceParams.pc) {
      setTickerOpen(true)
    }
  },[device])

  return (
    <ThemeContext.Provider value={{
      tickerOpen,
      setTickerOpen,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };