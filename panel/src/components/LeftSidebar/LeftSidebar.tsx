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
import LeftSidebarItem from "./LeftSidebarItem";

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
        <LeftSidebarItem tooltip="Upis rasporeda">
          <IoSchool size={30} />
          <span>Upis rasporeda</span>
        </LeftSidebarItem>

        <LeftSidebarItem tooltip="Upis izmjena">
          <BsTable size={30} />
          <span>Upis izmjena</span>
        </LeftSidebarItem>

        <LeftSidebarItem tooltip="Postavke">
          <IoSettings size={30} />
          <span>Postavke</span>
        </LeftSidebarItem>

        <LeftSidebarItem tooltip="Odjava">
          <BiLogOut size={30} />
          <span>Odjava</span>
        </LeftSidebarItem>
      </div>
    </div>
  );
};

export default LeftSidebar;
