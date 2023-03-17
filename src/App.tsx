import { useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Albums from "./pages/Albums";
import SignIn from "./pages/SignIn";
import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar";
import MyAccount from "./pages/MyAccount";
import ResetPassword from "./pages/ResetPassword";
import { RemoveSlash } from "./utils/removeSlash";

import { verifyToken, setFromVerify } from "./redux/reducers/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { StateProps, AppDispatch } from "./utils/types";

import Container from "react-bootstrap/Container";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    auth: { verified },
    auth,
  } = useSelector((state: StateProps) => state);
  const expires = localStorage.getItem("expires");
  const userName = localStorage.getItem("userName");
  const AccessToken = localStorage.getItem("AccessToken");
  const shouldVerify =
    AccessToken !== null &&
    Number(expires) > Date.now() &&
    auth.AccessToken === null &&
    !verified;

  const shouldRevoke = AccessToken !== null && Number(expires) < Date.now();
  const isVerified = verified && AccessToken !== null;

  useEffect(() => {
    shouldRevoke &&
      ["AccessToken", "expires", "userName"].forEach((item) => {
        localStorage.removeItem(item);
      });
    shouldVerify &&
      dispatch(verifyToken({ userName: userName!, token: AccessToken }));
    isVerified &&
      dispatch(
        setFromVerify({
          userName: userName!,
          token: AccessToken,
          expires: expires,
        })
      );
  }, [verified]);

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
