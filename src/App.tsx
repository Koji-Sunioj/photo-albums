import { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";

import Albums from "./pages/Albums";
import SignIn from "./pages/SignIn";
import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar";
import MyAccount from "./pages/MyAccount";
import ResetPassword from "./pages/ResetPassword";
import { RemoveSlash } from "./utils/removeSlash";

import Container from "react-bootstrap/Container";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Container>
        <RemoveSlash />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route
            path="/my-account/reset-password"
            element={<ResetPassword />}
          />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
