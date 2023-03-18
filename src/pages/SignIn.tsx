import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { StateProps, AppDispatch, AuthType } from "../utils/types";
import { signIn, resetMessage } from "../redux/reducers/userSlice";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";

import AuthForm from "../components/AuthForm";

const SignIn = () => {
  const {
    auth: { AccessToken, loading, message },
    auth,
  } = useSelector((state: StateProps) => state);
  const navigate = useNavigate();
  const [flow, setFlow] = useState("init");
  const dispatch = useDispatch<AppDispatch>();

  const shouldRedirect = AccessToken !== null && flow === "redirect";

  useEffect(() => {
    shouldRedirect &&
      (() => {
        ["AccessToken", "expires", "userName"].forEach((item) => {
          const value = auth[item as keyof AuthType];
          localStorage.setItem(item, String(value)!);
        });
        dispatch(resetMessage());
        navigate("/", {
          state: { message: "successfully signed in", variant: "success" },
        });
        setFlow("init");
      })();
  });

  const initiateAuth = (event: React.FormEvent<HTMLFormElement>) => {
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

  return (
    <Row>
      <Col lg="4">
        <h2>Sign In</h2>
        <AuthForm
          loading={loading}
          authHandler={initiateAuth}
          page={"sign-in"}
        />
        <Link className="mb-3" to={"/sign-up"}>
          Don't have an account yet? Sign up!
        </Link>
        <br />
        <Link className="mb-3" to={"forgot-password"}>
          Forgot password?
        </Link>
        <br />
        {message !== null && (
          <Alert variant={message.variant}>{message.value}</Alert>
        )}
      </Col>
    </Row>
  );
};

export default SignIn;
