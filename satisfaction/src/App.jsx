import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SatisfactionEntryScreen from "./pages/SatisfactionEntryScreen";
import Satisfaction from "./pages/Satisfaction";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SatisfactionEntryScreen />} />
        <Route path="/satisfaction" element={<Satisfaction />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
