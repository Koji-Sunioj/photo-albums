import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  displayFilter,
  displayToggle,
} from "../redux/reducers/navBarToggleSlice";
import {
  resetUser,
  verifyToken,
  setFromVerify,
  setCounter,
} from "../redux/reducers/userSlice";

import { useSelector, useDispatch } from "react-redux";
import { StateProps, AppDispatch } from "../utils/types";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    filterToggle: { filterDisplay, toggleDisplay },
    filter,
    auth: { verified, counter },
    auth,
  } = useSelector((state: StateProps) => state);
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

  useEffect(() => {
    pathname === "/albums"
      ? dispatch(displayToggle(true))
      : dispatch(displayToggle(false));

    shouldRevoke &&
      ["AccessToken", "expires", "userName"].forEach((item) => {
        localStorage.removeItem(item);
      });
    shouldVerify &&
      dispatch(verifyToken({ userName: userName!, token: AccessToken! }));

    isVerified &&
      dispatch(
        setFromVerify({
          userName: userName!,
          token: AccessToken,
          expires: expires,
          counter: Math.trunc((Number(expires) - Date.now()) / 1000),
        })
      );

    if (counter !== null && counter <= 0) {
      ["AccessToken", "expires", "userName"].forEach((item) => {
        localStorage.removeItem(item);
      });
      dispatch(resetUser());
      navigate("/", {
        state: { message: "session timed out", variant: "info" },
      });
    }

    if (counter !== null && counter > 0) {
      const interval = setInterval(() => {
        dispatch(setCounter(counter - 1));
      }, 1000);

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
              <Nav.Link as={Link} to="/my-account">
                My account
              </Nav.Link>
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
