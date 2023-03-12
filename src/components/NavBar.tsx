import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

import { useEffect } from "react";
import { AppDispatch } from "../redux/store";
import { Link, useLocation } from "react-router-dom";

import {
  displayFilter,
  displayToggle,
} from "../redux/reducers/navBarToggleSlice";
import { useSelector, useDispatch } from "react-redux";

import { StateProps } from "../utils/types";

function NavBar() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    filterToggle: { filterDisplay, toggleDisplay },
  } = useSelector((state: StateProps) => state);
  const currentLocation = useLocation();
  const { pathname } = currentLocation;

  useEffect(() => {
    pathname === "/albums"
      ? dispatch(displayToggle(true))
      : dispatch(displayToggle(false));
  }, [pathname]);

  return (
    <Navbar bg="dark" expand="lg" variant="dark" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Iron Pond Productions
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/albums" state={{ path: pathname }}>
              Photo Albums
            </Nav.Link>
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
}

export default NavBar;
