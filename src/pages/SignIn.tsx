import { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

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
  const { state } = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const shouldRedirect = AccessToken !== null && message !== null;

  useEffect(() => {
    shouldRedirect &&
      (() => {
        ["AccessToken", "expires", "userName"].forEach((item) => {
          const value = auth[item as keyof AuthType];
          localStorage.setItem(item, String(value)!);
        });
        dispatch(resetMessage());
        navigate("/", {
          state: message,
        });
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
    dispatch(signIn({ userName: userName, password: password }));
  };

  const signInMessage =
    message !== null ? message : state !== null ? state : null;

  return (
    <Row>
      <Col lg="4">
        <h2>Sign In</h2>
        <AuthForm
          loading={loading}
          authHandler={initiateAuth}
          page={"sign-in"}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link className="mb-2" to={"/sign-up"}>
            Don't have an account yet? Sign up!
          </Link>
          <Link className="mb-2" to={"forgot-password"}>
            Forgot password?
          </Link>
        </div>
        {signInMessage !== null && (
          <Alert variant={signInMessage.variant}>{signInMessage.value}</Alert>
        )}
      </Col>
    </Row>
  );
};

export default SignIn;
