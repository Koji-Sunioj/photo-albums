import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  displayFilter,
  displayToggle,
} from "../redux/reducers/navBarToggleSlice";
import { useSelector, useDispatch } from "react-redux";
import { StateProps, AppDispatch } from "../utils/types";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    filterToggle: { filterDisplay, toggleDisplay },
    filter,
  } = useSelector((state: StateProps) => state);
  const { pathname } = useLocation();

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
