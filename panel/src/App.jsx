import React, { useEffect, useState } from "react";
import "./assets/style/App.css";
import LeftSidebar from "./components/LeftSidebar";
import Classes from "./pages/Classes";
import Changes from "./pages/Changes";
import Logout from "./pages/Logout";
import Login from "./pages/Login";
import routes from "./data/routes.json";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useToken, useTheme, useLeftsidebar } from "./store/hooks";
import API_HOST from "./data/api";

const App = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const token = useToken();
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

    const [login, setLogin] = useState(false);

    useEffect(() => {
        const getUser = async() => {
            const res = await fetch(`${API_HOST}/api/admin/user`, {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin" : `${API_HOST}:3000`,
                    "Authorization": `Bearer ${token}`
                },
                method: "GET",
            });

            const user = await res.json();

            if (user.code === 200) {
                setLogin(true);
                navigate(routes.changes.path, { replace: true});
            }
        }

        getUser();
    }, []);

    return (
        <div className="App" data-theme={theme}>
            {login ? <LeftSidebar smallScreen={windowWidth > 450 ? "" : "small-screen"} /> : null}
            <div className={isLeftSidebarOpen && windowWidth > 730 ? "content active" : "content"}>
                <Routes>
                    <Route path={routes.login.path} 
                        element={ login ? <Navigate to={routes.changes.path} replace /> : <Login login={() => setLogin(true)} /> } 
                    />

                    <Route path={routes.settings.classes.path} 
                        element={ login ? <Classes /> : <Navigate to={routes.login.path} replace /> } 
                    />

                    <Route path={routes.changes.path} 
                        element={ login ? <Changes /> : <Navigate to={routes.login.path} replace /> } 
                    />

                    <Route path={routes.logout.path} 
                        element={ login ? <Logout logout={() => setLogin(false)} /> : <Navigate to={routes.login.path} replace /> } 
                    />
                    
                    {/* Preusmjeri korisnika ako je putanja nepoznata */}
                    <Route path="*" 
                        element={ login ? <Navigate to={routes.changes.path} replace /> : <Navigate to={routes.login.path} replace /> } 
                    />
                </Routes>
            </div>
        </div>
    );
}

export default App;
