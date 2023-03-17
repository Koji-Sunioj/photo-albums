import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { StateProps, AppDispatch } from "../utils/types";
import {
  setMessage,
  resetPassword,
  resetPatch,
} from "../redux/reducers/userSlice";

import { checkPw } from "../utils/checkPw";
import AuthForm from "../components/AuthForm";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";

const ResetPassword = () => {
  const {
    auth: { AccessToken, expires, userName, loading, patched, message },
  } = useSelector((state: StateProps) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const hasReset = AccessToken !== null && patched;

  useEffect(() => {
    hasReset &&
      setTimeout(() => {
        dispatch(resetPatch());
        navigate("/my-account");
      }, 1500);
  }, [patched]);

  const initiateResest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      currentTarget: {
        confirmPassword: { value: confirmPassword },
        password: { value: password },
      },
    } = event;
    const isInValid = checkPw(password, confirmPassword);
    if (isInValid) {
      dispatch(
        setMessage({ variant: "danger", value: "passwords don't match!" })
      );
    } else {
      dispatch(
        resetPassword({
          email: userName!,
          password: password,
          token: AccessToken!,
        })
      );
    }
  };

  return (
    <Row>
      <Col lg="4">
        <h2>Reset password for {userName}</h2>
        <AuthForm
          page={"reset-password"}
          authHandler={initiateResest}
          loading={loading}
        />
        {message !== null && (
          <Alert variant={message.variant}>{message.value}</Alert>
        )}
      </Col>
    </Row>
  );
};

export default ResetPassword;
