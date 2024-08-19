import { useContext } from "react";
import { DeviceContext } from "../contexts/DeviceContext";

const useDevice = () => useContext(DeviceContext)

export default useDevice;