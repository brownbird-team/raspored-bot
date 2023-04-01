import "./LeftSidebar.css";
import { IoIosClose, RxHamburgerMenu } from "react-icons/all";
import { useState } from "react";
import LeftSidebarItem from "./LeftSidebarItem";
import items from "../../data/LeftSidebar";

const LeftSidebar = () => {
    const [active, setActive] = useState(false);
    const [admin, setAdmin] = useState("admin"); // Promijeniti kasnije

    return (
        <div className={active ? "left-sidebar active" : "left-sidebar"}>
            <div className="left-sidebar-heading">
                <h4>Panel</h4>
                {active ? (
                    <IoIosClose color="white" size={50} onClick={() => setActive(false)} className="sidebar-icon" />
                ) : (
                    <RxHamburgerMenu color="white" size={30} onClick={() => setActive(true)} className="sidebar-icon" />
                )}
            </div>
            <h6 className="sidebar-admin">{admin}</h6>
            <div className="left-sidebar-items">
                {items.map((item) => (
                    <LeftSidebarItem key={item.title} item={item} />
                ))}
            </div>
        </div>
    );
};

export default LeftSidebar;
