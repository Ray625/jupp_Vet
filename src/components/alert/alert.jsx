import { createPortal } from "react-dom";
import { useEffect } from "react";

const OneBtnAlert = ({ title, button, handleClose, handleConfirm }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return createPortal(
    <div className="z-[999] fixed top-0 left-0 flex w-full h-full justify-center items-center bg-[rgba(0,0,0,0.5)]">
      <div className="z-[999] relative flex flex-col gap-8 justify-center items-center w-[486px] max-w-[90%] md:max-w-[60%] h-[320px] max-h-[40%] bg-white rounded-[20px] shadow-[0_0_40px_0_#0000001F]">
        <button
          className="absolute top-7 right-9 flex justify-center items-center w-10 h-8 hover:opacity-80"
          onClick={handleClose}
        >
          <i className="fa-solid fa-xmark fa-xl"></i>
        </button>
        <p className="text-center px-16 text-2xl">{title}</p>
        <button
          className="relative w-[152px] h-[48px] rounded-full text-white bg-gradient-to-r from-primary-orange to-dark-orange transition-all hover:text-white overflow-hidden"
          onClick={handleConfirm}
        >
          <span className="relative z-10 pointer-events-none">{button}</span>
          <span className="absolute inset-0 bg-gradient-to-r from-dark-orange to-dark-orange opacity-0 hover:opacity-100 transition-opacity"></span>
        </button>
      </div>
    </div>,
    document.body
  );
};

const ConfirmAlert = ({ title, handleCancel, handleConfirm, handleClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return createPortal(
    <div className="z-[999] fixed top-0 left-0 flex w-full h-full justify-center items-center bg-[rgba(0,0,0,0.5)]">
      <div className="z-[999] relative flex flex-col gap-8 justify-center items-center w-[486px] max-w-[90%] md:max-w-[60%] h-[320px] max-h-[40%] bg-white rounded-[20px] shadow-[0_0_40px_0_#0000001F]">
        <button
          className="absolute top-7 right-9 flex justify-center items-center w-10 h-8 hover:opacity-80"
          onClick={handleClose}
        >
          <i className="fa-solid fa-xmark fa-xl"></i>
        </button>
        <p className="text-center px-16 text-2xl">{title}</p>
        <div className="flex gap-6">
          <button
            className="w-[152px] h-[48px] rounded-full text-white bg-disabled-gray border border-disabled-gray hover:bg-white hover:text-disabled-gray transition-all duration-200"
            onClick={handleCancel}
          >
            返回
          </button>
          <button
            className="w-[152px] h-[48px] rounded-full  text-white bg-primary-blue border border-primary-blue hover:bg-white hover:text-primary-blue transition-all duration-200"
            onClick={handleConfirm}
          >
            確認
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export { OneBtnAlert, ConfirmAlert };
