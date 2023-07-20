import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  setMessage,
  resetPassword,
  resetPatch,
} from "../redux/reducers/userSlice";
import { checkPw } from "../utils/checkPw";
import { TAppState, AppDispatch } from "../utils/types";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import AuthForm from "../components/AuthForm";

const ResetPassword = () => {
  const {
    auth: { AccessToken, userName, loading, patched, message },
  } = useSelector((state: TAppState) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const hasReset = AccessToken !== null && patched === "reset";

  useEffect(() => {
    hasReset &&
      (() => {
        dispatch(resetPatch());
        navigate("/my-account", {
          state: message,
        });
      })();
  });

  const initiateReset = (event: React.FormEvent<HTMLFormElement>) => {
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
          authHandler={initiateReset}
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
