import React, { useEffect, useState } from "react";
import "./assets/style/App.css";
import "./assets/style/filters.css";
import LeftSidebar from "./components/LeftSidebar";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import routes from "./data/routes.json";
import ScheduleImport from "./pages/ScheduleImport";
import Changes from "./pages/ChangesSubject";
import ClassFilter from "./pages/ClassFilter";
import PeriodFilter from "./pages/PeriodFilter";
import Days from "./pages/Days";
import Weeks from "./pages/Weeks/Weeks";
import Logout from "./pages/Logout";
import Login from "./pages/Login";
import { useLogin } from "./store/hooks";

const App = () => {
    const navigate = useNavigate();
    const theme = useSelector((state) => state.theme.value);
    const login = useLogin();
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
    }, []);

    return (
        <div className="App" data-theme={theme}>
            {login === "true" ? <LeftSidebar smallScreen={windowWidth > 450 ? "" : "small-screen"} /> : null}
            <div className={isLeftSidebarOpen && windowWidth > 730 ? "content active" : "content"}>
                <Routes>
                    <Route path={routes.login.path} 
                        element={ login === "true" ? <Navigate to={routes.schedule.import.path} replace /> : <Login /> } 
                    />

                    <Route path={routes.schedule.import.path} 
                        element={ login === "true" ? <ScheduleImport /> : <Navigate to={routes.login.path} replace /> } 
                    />
                    <Route path={routes.changes.subject_classroom.path} 
                        element={ login === "true" ? <Changes /> : <Navigate to={routes.login.path} replace /> } 
                    />
                    <Route path={routes.filter.class.path} 
                        element={ login === "true" ? <ClassFilter /> : <Navigate to={routes.login.path} replace /> } 
                    />
                    <Route path={routes.filter.period.path} 
                        element={ login === "true" ? <PeriodFilter /> : <Navigate to={routes.login.path} replace /> } 
                    />
                    <Route path={routes.days.path} 
                        element={ login === "true" ? <Days /> : <Navigate to={routes.login.path} replace /> } 
                    />
                    <Route path={routes.weeks.path} 
                        element={ login === "true" ? <Weeks /> : <Navigate to={routes.login.path} replace /> } 
                    />
                    <Route path={routes.logout.path} 
                        element={ login === "true" ? <Logout /> : <Navigate to={routes.login.path} replace /> } 
                    />
                    
                    {/* Preusmjeri korisnika na /schedule/import ako je putanja nepoznata */}
                    <Route path="*" 
                        element={ login === "true" ? <Navigate to={routes.schedule.import.path} replace /> : <Navigate to={routes.login.path} replace /> } 
                    />
                </Routes>
            </div>
        </div>
    );
}

export default App;
