import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import DogProfile from "./components/DogProfile";
import Header from "./components/Header";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dogs/:id" element={<DogProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
