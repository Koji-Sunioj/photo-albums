import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { StateProps, AppDispatch } from "../utils/types";
import { signIn, resetUser } from "../redux/reducers/userSlice";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

const Auth = ({ page }: { page: string }) => {
  const {
    auth: { AccessToken, expires, userName, loading },
  } = useSelector((state: StateProps) => state);
  const navigate = useNavigate();
  const [flow, setFlow] = useState("init");
  const dispatch = useDispatch<AppDispatch>();

  const shouldRedirect = AccessToken !== null && flow === "redirect";
  const shouldSignOut = AccessToken !== null && flow === "sign-out";

  useEffect(() => {
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
  }, [AccessToken, flow]);

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
                    placeholder="Password"
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
        {page === "my-account" && (
          <>
            <h2>Welcome {userName}</h2>
            <Stack direction="horizontal" gap={3} className="mb-3">
              <Button>Reset Password</Button>
              <Button onClick={signOut}>Sign Out</Button>
            </Stack>
          </>
        )}
      </Col>
    </Row>
  );
};

export default Auth;
