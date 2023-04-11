import React from "react";
import "./assets/style/App.css";
import "./assets/style/filters.css";
import LeftSidebar from "./components/LeftSidebar";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import routes from "./data/routes.json";
import ScheduleImport from "./pages/ScheduleImport";
import SubjectClassroomChanges from "./pages/SubjectClassroomChanges";
import ClassFilter from "./pages/ClassFilter";
import PeriodFilter from "./pages/PeriodFilter";
import Weeks from "./pages/Weeks/Weeks";
import Logout from "./pages/Logout";

const App = () => {
    const theme = useSelector((state) => state.theme.value);

    return (
        <div className="App" data-theme={theme}>
            <LeftSidebar />
            <div className="content">
                <Routes>
                    <Route path={routes.schedule.import.path} element={<ScheduleImport />} />
                    <Route path={routes.changes.subject_classroom.path} element={<SubjectClassroomChanges />} />
                    <Route path={routes.filter.class.path} element={<ClassFilter />} />
                    <Route path={routes.filter.period.path} element={<PeriodFilter />} />
                    <Route path={routes.weeks.path} element={<Weeks />} />
                    <Route path={routes.logout.path} element={<Logout />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
