import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { StateProps, AppDispatch } from "../utils/types";
import {
  forgotPassword,
  setMessage,
  confirmForgotPassword,
} from "../redux/reducers/userSlice";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";

import { checkPw } from "../utils/checkPw";
import AuthForm from "../components/AuthForm";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, patched, message, userName } = useSelector(
    (state: StateProps) => state.auth
  );

  useEffect(() => {
    if (patched === "reset") {
      navigate("/sign-in");
    }
  });

  const initiateForgot = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      currentTarget: {
        email: { value: email },
      },
    } = event;
    dispatch(forgotPassword({ email: email }));
  };

  const initiateConfirmForgot = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      confirmation: { value: confirmation },
      password: { value: password },
      confirmPassword: { value: confirmPassword },
    } = event.currentTarget;
    const isInValid = checkPw(password, confirmPassword);
    if (isInValid) {
      dispatch(
        setMessage({ variant: "danger", value: "password does not wmatch" })
      );
    }
    dispatch(
      confirmForgotPassword({
        email: userName!,
        password: password,
        confirmation: confirmation,
      })
    );
  };

  console.log(userName, patched);

  const shouldMessage = message !== null && message.hasOwnProperty("variant");

  return (
    <Col lg="4">
      <Row>
        {patched === "confirmed" ? (
          <>
            <h2>Confirm new password</h2>
            <AuthForm
              page={"confirm-forgot-password"}
              loading={loading}
              authHandler={initiateConfirmForgot}
            />
          </>
        ) : (
          <>
            <h2>Reset Password</h2>
            <AuthForm
              page={"forgot-password"}
              loading={loading}
              authHandler={initiateForgot}
            />
          </>
        )}
        {shouldMessage && (
          <Alert variant={message.variant}>{message.value}</Alert>
        )}
      </Row>
    </Col>
  );
};
export default ForgotPassword;
