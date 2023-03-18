import { useNavigate, Link, useLocation } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { resetUser } from "../redux/reducers/userSlice";
import { StateProps, AppDispatch } from "../utils/types";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";

const MyAccount = () => {
  const {
    auth: { userName },
  } = useSelector((state: StateProps) => state);
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const signOut = () => {
    ["AccessToken", "expires", "userName"].forEach((item) => {
      localStorage.removeItem(item);
    });
    dispatch(resetUser());
    navigate("/", {
      state: { value: "successfully signed out", variant: "info" },
    });
  };

  const shouldMessage = state !== null && state.hasOwnProperty("variant");

  return (
    <Row>
      <Col lg="4">
        <h2>Welcome {userName}</h2>
        <Stack direction="horizontal" gap={3} className="mb-3">
          <Link to="reset-password">
            <Button>Reset Password</Button>
          </Link>
          <Button onClick={signOut}>Sign Out</Button>
        </Stack>
        {shouldMessage && <Alert variant={state.variant}>{state.value}</Alert>}
      </Col>
    </Row>
  );
};

export default MyAccount;
