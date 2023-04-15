import React, { useEffect, useState } from "react";
import "./assets/style/App.css";
import LeftSidebar from "./components/LeftSidebar";
import Classes from "./pages/Classes";
import Changes from "./pages/Changes";
import Logout from "./pages/Logout";
import Login from "./pages/Login";
import routes from "./data/routes.json";
import { Routes, Route, Navigate } from "react-router-dom";
import { useLogin, useTheme, useLeftsidebar } from "./store/hooks";

const App = () => {
    const theme = useTheme();
    const login = useLogin();
    const isLeftSidebarOpen = useLeftsidebar();
    
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
                        element={ login === "true" ? <Navigate to={routes.changes.path} replace /> : <Login /> } 
                    />

                    <Route path={routes.settings.classes.path} 
                        element={ login === "true" ? <Classes /> : <Navigate to={routes.login.path} replace /> } 
                    />

                    <Route path={routes.changes.path} 
                        element={ login === "true" ? <Changes /> : <Navigate to={routes.login.path} replace /> } 
                    />

                    <Route path={routes.logout.path} 
                        element={ login === "true" ? <Logout /> : <Navigate to={routes.login.path} replace /> } 
                    />
                    
                    {/* Preusmjeri korisnika ako je putanja nepoznata */}
                    <Route path="*" 
                        element={ login === "true" ? <Navigate to={routes.changes.path} replace /> : <Navigate to={routes.login.path} replace /> } 
                    />
                </Routes>
            </div>
        </div>
    );
}

export default App;
