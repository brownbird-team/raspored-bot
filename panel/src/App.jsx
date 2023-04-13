import React, { useEffect, useState } from "react";
import "./assets/style/App.css";
import "./assets/style/filters.css";
import LeftSidebar from "./components/LeftSidebar";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import routes from "./data/routes.json";
import ScheduleImport from "./pages/ScheduleImport";
import Changes from "./pages/ChangesSubject";
import ClassFilter from "./pages/ClassFilter";
import PeriodFilter from "./pages/PeriodFilter";
import Days from "./pages/Days";
import Weeks from "./pages/Weeks/Weeks";
import Logout from "./pages/Logout";

const App = () => {
    const theme = useSelector((state) => state.theme.value);
    const isLeftSidebarOpen = useSelector((state) => state.leftSidebar.value);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    useEffect(() => {
        const handleWindowResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    });

    return (
        <div className="App" data-theme={theme}>
            <LeftSidebar 
                smallScreen={ windowWidth > 450 ? "" : "small-screen"}
            />
            <div className={isLeftSidebarOpen && windowWidth > 730 ? "content active" : "content"}>
                <Routes>
                    <Route path={routes.schedule.import.path} element={<ScheduleImport />} />
                    <Route path={routes.changes.subject_classroom.path} element={<Changes />} />
                    <Route path={routes.filter.class.path} element={<ClassFilter />} />
                    <Route path={routes.filter.period.path} element={<PeriodFilter />} />
                    <Route path={routes.days.path} element={<Days />} />
                    <Route path={routes.weeks.path} element={<Weeks />} />
                    <Route path={routes.logout.path} element={<Logout />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
