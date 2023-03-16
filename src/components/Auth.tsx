import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { StateProps, AppDispatch } from "../utils/types";
import {
  signIn,
  setMessage,
  resetUser,
  resetPassword,
  resetPatch,
} from "../redux/reducers/userSlice";

import { checkPw } from "../utils/checkPw";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

const Auth = ({ page }: { page: string }) => {
  const {
    auth: { AccessToken, expires, userName, loading, patched, message },
  } = useSelector((state: StateProps) => state);
  const navigate = useNavigate();
  const [flow, setFlow] = useState("init");
  const dispatch = useDispatch<AppDispatch>();

  const shouldRedirect = AccessToken !== null && flow === "redirect";
  const shouldSignOut = AccessToken !== null && flow === "sign-out";
  const hasReset = AccessToken !== null && patched;

  useEffect(() => {
    hasReset &&
      setTimeout(() => {
        dispatch(resetPatch());
        navigate("/my-account");
      }, 1500);
    shouldRedirect &&
      setTimeout(() => {
        navigate("/");
        setFlow("init");
      }, 1500);
    shouldSignOut &&
      setTimeout(() => {
        dispatch(resetUser());
        navigate("/");
        setFlow("init");
      }, 1500);
  }, [AccessToken, flow, patched]);

  const authHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      currentTarget: {
        email: { value: userName },
        password: { value: password },
      },
    } = event;
    setFlow("redirect");
    dispatch(signIn({ userName: userName, password: password }));
  };

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

  const signOut = () => {
    setFlow("sign-out");
  };

  return (
    <Row>
      <Col lg="4">
        {page === "sign-in" && (
          <>
            <h2>Sign In</h2>
            <Form className="mb-3" onSubmit={authHandler}>
              <fieldset disabled={loading}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    autoComplete="on"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="password"
                    name="password"
                    autoComplete="on"
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </fieldset>
            </Form>
            <Link className="mb-3" to={"/sign-up"}>
              Don't have an account yet? Sign up!
            </Link>
            <br />
            <Link className="mb-3" to={"/forgot-password"}>
              Forgot password?
            </Link>
            <br />
            {shouldRedirect && (
              <Alert variant="success">successfully signed in</Alert>
            )}
          </>
        )}
        {page === "reset-password" && (
          <>
            <h2>Reset password for {userName}</h2>
            <Form className="mb-3" onSubmit={initiateResest}>
              <fieldset disabled={loading}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="password"
                    name="password"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="confirm password"
                    name="confirmPassword"
                  />
                  <Form.Text className="text-muted">
                    Password should be over seven characters and have at least
                    one uppercase letter
                  </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </fieldset>
            </Form>
            {message !== null && (
              <Alert variant={message.variant}>{message.value}</Alert>
            )}
          </>
        )}
        {page === "my-account" && (
          <>
            <h2>Welcome {userName}</h2>
            <Stack direction="horizontal" gap={3} className="mb-3">
              <Link to="reset-password">
                <Button>Reset Password</Button>
              </Link>
              <Button onClick={signOut}>Sign Out</Button>
            </Stack>
          </>
        )}
      </Col>
    </Row>
  );
};

export default Auth;
