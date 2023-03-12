import Container from "react-bootstrap/Container";

import { Routes, Route, BrowserRouter } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Albums from "./pages/Albums";
import NavBar from "./components/NavBar";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/albums" element={<Albums />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
