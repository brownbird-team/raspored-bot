import "./App.css";
import LeftSidebar from "./components/LeftSidebar";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div className="App">
      <LeftSidebar />
      <div className="content">
        <Routes>
          <Route path="/import" element={<div>Import</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
