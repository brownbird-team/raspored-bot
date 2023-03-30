import "./assets/App.css";
import LeftSidebar from "./components/LeftSidebar";
import { Routes, Route } from "react-router-dom";
import routes from "./data/Routes.json";
import ScheduleImport from "./pages/ScheduleImport";
import SubjectClassroomChanges from "./pages/SubjectClassroomChanges";
import ClassFilter from "./pages/ClassFilter";
import PeriodFilter from "./pages/PeriodFilter";
import Logout from "./pages/Logout";

const App = () => {
  return (
    <div className="App">
      <LeftSidebar />
      <div className="content">
        <Routes>
          <Route
            path={routes.schedule.import.path}
            element={<ScheduleImport />}
          />
          <Route
            path={routes.changes.subject_classroom.path}
            element={<SubjectClassroomChanges />}
          />
          <Route path={routes.filter.class.path} element={<ClassFilter />} />
          <Route path={routes.filter.period.path} element={<PeriodFilter />} />
          <Route path={routes.logout.path} element={<Logout />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
