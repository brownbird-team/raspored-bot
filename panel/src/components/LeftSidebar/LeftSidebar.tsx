import "./LeftSidebar.css";
import {
  IoIosClose,
  RxHamburgerMenu,
  IoSchool,
  BiLogOut,
  IoSettings,
  BsTable,
} from "react-icons/all";
import { useState } from "react";

const LeftSidebar = () => {
  const [active, setActive] = useState("");
  const [admin, setAdmin] = useState("admin"); // Promijeniti kasnije

  return (
    <div className={`left-sidebar ${active}`}>
      <div className="left-sidebar-heading">
        <h4>Panel</h4>
        {active === "active" ? (
          <IoIosClose
            color="white"
            size={50}
            onClick={() => setActive("")}
            className="sidebar-icon"
          />
        ) : (
          <RxHamburgerMenu
            color="white"
            size={30}
            onClick={() => setActive("active")}
            className="sidebar-icon"
          />
        )}
      </div>
      <h6 className="sidebar-admin">{admin}</h6>
      <div className="left-sidebar-items">
        <div className="left-sidebar-item">
          <button type="button">
            <IoSchool size={30} />
            <span>Unesi raspored</span>
          </button>
          <span className="item-tooltip">Unesi raspored</span>
        </div>
        <div className="left-sidebar-item">
          <button type="button">
            <BsTable size={30} />
            <span>Unesi izmjene</span>
          </button>
          <span className="item-tooltip">Unesi izmjene</span>
        </div>
        <div className="left-sidebar-item">
          <button type="button">
            <IoSettings size={30} />
            <span>Postavke</span>
          </button>
          <span className="item-tooltip">Postavke</span>
        </div>
        <div className="left-sidebar-item">
          <button type="button">
            <BiLogOut size={30} />
            <span>Odjava</span>
          </button>
          <span className="item-tooltip">Odjava</span>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
