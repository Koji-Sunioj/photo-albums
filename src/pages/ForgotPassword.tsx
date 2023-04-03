import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { TAppState, AppDispatch } from "../utils/types";
import {
  forgotPassword,
  setMessage,
  confirmForgotPassword,
  resetUser,
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
    (state: TAppState) => state.auth
  );

  useEffect(() => {
    if (patched === "reset") {
      dispatch(resetUser());
      navigate("/sign-in", {
        state: message,
      });
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

  const shouldMessage = message !== null && message.hasOwnProperty("variant");

  return (
    <Row>
      <Col lg="4">
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
      </Col>
    </Row>
  );
};
export default ForgotPassword;
