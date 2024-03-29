import { useSelector } from "react-redux";
import { TAppState } from "./utils/types";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Album from "./pages/Album";
import Albums from "./pages/Albums";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar";
import MyAccount from "./pages/MyAccount";
import CreateAlbum from "./pages/CreateAlbum";
import ResetPassword from "./pages/ResetPassword";
import { RemoveSlash } from "./utils/removeSlash";
import ForgotPassword from "./pages/ForgotPassword";

import Container from "react-bootstrap/Container";

function App() {
  const { verified } = useSelector((state: TAppState) => state.auth);

  return (
    <BrowserRouter>
      <NavBar />
      <Container>
        <RemoveSlash />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in/forgot-password" element={<ForgotPassword />} />
          <Route path="/albums/:albumId" element={<Album />} />
          {verified && (
            <>
              <Route
                path="/create-album"
                element={<CreateAlbum task={"create"} />}
              />
              <Route
                path="/edit-album/:albumId"
                element={<CreateAlbum task={"edit"} />}
              />
              <Route path="/my-account" element={<MyAccount />} />
              <Route
                path="/my-account/reset-password"
                element={<ResetPassword />}
              />
            </>
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
