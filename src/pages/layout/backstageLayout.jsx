import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

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
  const navigate = useNavigate()

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
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BackstageLayout;