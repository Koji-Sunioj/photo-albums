import { Routes, Route, BrowserRouter } from "react-router-dom";

import Auth from "./components/Auth";
import Albums from "./pages/Albums";
import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar";
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
          <Route path="/sign-in" element={<Auth page={"sign-in"} />} />
          <Route path="/my-account" element={<Auth page={"my-account"} />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
