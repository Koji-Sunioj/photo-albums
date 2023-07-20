import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  resetUser,
  verifyToken,
  setFromVerify,
  setCounter,
} from "../redux/reducers/userSlice";
import {
  displayFilter,
  displayToggle,
} from "../redux/reducers/navBarToggleSlice";
import { TAppState, AppDispatch } from "../utils/types";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { filterDisplay, toggleDisplay } = useSelector(
    (state: TAppState) => state.filterToggle
  );
  const filter = useSelector((state: TAppState) => state.filter);
  const auth = useSelector((state: TAppState) => state.auth);
  const { verified, counter } = auth;

  const { pathname } = useLocation();
  const expires = localStorage.getItem("expires");
  const userName = localStorage.getItem("userName");
  const AccessToken = localStorage.getItem("AccessToken");

  const shouldVerify =
    !verified &&
    AccessToken !== null &&
    Number(expires) > Date.now() &&
    auth.AccessToken === null;
  const shouldRevoke = AccessToken !== null && Number(expires) < Date.now();
  const isVerified =
    verified &&
    AccessToken !== null &&
    !window.location.href.includes("sign-in") &&
    auth.AccessToken === null;

  const expiredToken = counter !== null && counter <= 0;
  const validToken = counter !== null && counter > 0;

  useEffect(() => {
    pathname === "/albums"
      ? dispatch(displayToggle(true))
      : dispatch(displayToggle(false));

    shouldVerify &&
      dispatch(verifyToken({ userName: userName!, token: AccessToken! }));

    isVerified &&
      dispatch(
        setFromVerify({
          userName: userName!,
          AccessToken: AccessToken,
          expires: expires,
          counter: Math.trunc((Number(expires) - Date.now()) / 1000),
        })
      );

    (shouldRevoke || expiredToken) &&
      ["AccessToken", "expires", "userName"].forEach((item) => {
        localStorage.removeItem(item);
      });

    if (expiredToken) {
      dispatch(resetUser());
      navigate("/", {
        state: { message: "session timed out", variant: "info" },
      });
    }

    if (validToken) {
      const interval = setInterval(() => {
        dispatch(setCounter(counter - 1));
      }, 60000);

      return () => clearInterval(interval);
    }
  });

  return (
    <Navbar bg="dark" expand="lg" variant="dark" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Iron Pond Productions
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/albums"
              onClick={(event) => {
                event.preventDefault();
                const filterString = Object.entries(filter)
                  .map((thing) => thing.join("="))
                  .join("&");
                navigate({
                  pathname: "/albums",
                  search: `${filterString}`,
                });
              }}
            >
              Photo Albums
            </Nav.Link>
            {verified ? (
              <>
                <Nav.Link as={Link} to="/my-account">
                  My account
                </Nav.Link>
                <Nav.Link as={Link} to="/create-album">
                  Create album
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/sign-in">
                Sign in
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {toggleDisplay && (
              <ButtonGroup style={{ width: "200px" }}>
                <ToggleButton
                  value={"checked"}
                  variant="outline-success"
                  type="checkbox"
                  checked={filterDisplay}
                  onClick={() => dispatch(displayFilter(!filterDisplay))}
                >
                  Toggle search filter
                </ToggleButton>
              </ButtonGroup>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
