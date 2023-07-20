import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  setMessage,
  signUp,
  confirmSignUp,
  resetUser,
} from "../redux/reducers/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { TAppState, AppDispatch } from "../utils/types";

import { checkPw } from "../utils/checkPw";
import AuthForm from "../components/AuthForm";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, message, patched, userName } = useSelector(
    (state: TAppState) => state.auth
  );

  useEffect(() => {
    if (patched === "signed") {
      dispatch(resetUser());
      navigate("/sign-in", {
        state: message,
      });
    }
  });

  const initiateSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      email: { value: email },
      password: { value: password },
      confirmPassword: { value: confirmPassword },
    } = event.currentTarget;

    const isInValid = checkPw(password, confirmPassword);
    isInValid
      ? dispatch(
          setMessage({ variant: "danger", value: "passwords don't match" })
        )
      : dispatch(signUp({ email: email, password: password }));
  };

  const initiateConfirmSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      confirmation: { value: confirmation },
    } = event.currentTarget;

    dispatch(
      confirmSignUp({ userName: userName!, confirmation: confirmation })
    );
  };

  return (
    <Row>
      <Col lg="4">
        {patched === "confirmed" ? (
          <>
            <h2>Confirm sign up</h2>
            <AuthForm
              loading={loading}
              authHandler={initiateConfirmSignUp}
              page={"confirm-sign-up"}
            />
          </>
        ) : (
          <>
            <h2>Sign up</h2>
            <AuthForm
              loading={loading}
              authHandler={initiateSignUp}
              page={"sign-up"}
            />
          </>
        )}
        {message !== null && (
          <Alert variant={message.variant}>{message.value}</Alert>
        )}
      </Col>
    </Row>
  );
};

export default SignUp;
