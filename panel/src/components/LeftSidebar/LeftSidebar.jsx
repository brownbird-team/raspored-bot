import React, { useState } from "react";
import "./LeftSidebar.css";
import { IoIosClose, RxHamburgerMenu } from "react-icons/all";
import LeftSidebarItem from "./LeftSidebarItem";
import items from "./items";
import { useDispatch } from "react-redux";
import { useUserActive, useLeftsidebar } from "../../store/hooks"; 
import { setOpen, setClose } from "../../features/leftSidebar";

const LeftSidebar = ({ smallScreen = "" }) => {
    const dispatch = useDispatch();
    const isOpen = useLeftsidebar();
    const admin = useUserActive();

    const handleOnOpen = () => dispatch(setOpen());
    
    const handleOnClose = () => dispatch(setClose());

    return (
        <div
            className={
                isOpen && smallScreen === ""
                    ? "left-sidebar active"
                    : isOpen && smallScreen !== ""
                    ? `left-sidebar active ${smallScreen}`
                    : "left-sidebar"
            }>
            <div className="left-sidebar-heading">
                <h4>Panel</h4>
                {isOpen ? (
                    <IoIosClose size={50} onClick={handleOnClose} className="sidebar-icon" />
                ) : (
                    <RxHamburgerMenu size={30} onClick={handleOnOpen} className="sidebar-icon" />
                )}
            </div>
            <h6 className="sidebar-admin">{admin.username}</h6>
            <div className="left-sidebar-items">
                {items.map((item) => (
                    <LeftSidebarItem key={item.title} item={item} />
                ))}
            </div>
        </div>
    );
};

export default LeftSidebar;
