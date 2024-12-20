import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./components/Login";

function App() {
  return (
    <div className="App">
        <Router basename="/mf-accounts">
            <Routes>
                <Route path="/login" element={<Login />}/>
            </Routes>
          
        </Router>
    </div>
  );
}

export default App;