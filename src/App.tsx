import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Albums from "./pages/Albums";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/albums" element={<Albums />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
