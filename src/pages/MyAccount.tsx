import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { StateProps, AppDispatch } from "../utils/types";
import { resetUser } from "../redux/reducers/userSlice";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

const MyAccount = () => {
  const {
    auth: { AccessToken, userName },
  } = useSelector((state: StateProps) => state);
  const navigate = useNavigate();
  const [flow, setFlow] = useState("init");
  const dispatch = useDispatch<AppDispatch>();

  const shouldSignOut = AccessToken !== null && flow === "sign-out";

  useEffect(() => {
    shouldSignOut &&
      setTimeout(() => {
        ["AccessToken", "expires", "userName"].forEach((item) => {
          localStorage.removeItem(item);
        });
        dispatch(resetUser());
        navigate("/");
        setFlow("init");
      }, 1500);
  }, [flow]);

  const signOut = () => {
    setFlow("sign-out");
  };

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
        {flow === "sign-out" && (
          <Alert variant="success">Successfully signed out</Alert>
        )}
      </Col>
    </Row>
  );
};

export default MyAccount;
