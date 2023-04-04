import React from "react";
import "./PageHeader.css";
import { MdDarkMode } from "react-icons/md";
import { FiSun } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { updateTheme } from "../../features/theme";

const PageHeader = ({ items }) => {
    const theme = useSelector((state) => state.theme.value);
    const dispatch = useDispatch();

    return (
        <div className="page-header">
            {items.map((item) => (
                <div key={item}>
                    <span>{item}</span>
                </div>
            ))}
            <div className="theme-icon" onClick={() => dispatch(updateTheme(theme === "dark" ? "light" : "dark"))}>
                {theme === "dark" ? <MdDarkMode size={25} /> : <FiSun size={25} />}
            </div>
        </div>
    );
};

export default PageHeader;
