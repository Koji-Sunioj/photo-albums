import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const AuthForm = ({
  page,
  loading,
  authHandler,
}: {
  page: string;
  loading: boolean;
  authHandler: (event: React.FormEvent<HTMLFormElement>) => void;
}) => (
  <Form className="mb-3" onSubmit={authHandler}>
    <fieldset disabled={loading}>
      {["sign-in", "forgot-password"].includes(page) && (
        <>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              autoComplete="on"
            />
          </Form.Group>
        </>
      )}
      {page === "confirm-forgot-password" && (
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="confirmation code"
            name="confirmation"
            autoComplete="off"
          />
        </Form.Group>
      )}
      {["sign-in", "reset-password", "confirm-forgot-password"].includes(
        page
      ) && (
        <>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="password"
              name="password"
              autoComplete="on"
            />
          </Form.Group>
        </>
      )}
      {["reset-password", "confirm-forgot-password"].includes(page) && (
        <>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="confirm password"
              name="confirmPassword"
            />
            <Form.Text className="text-muted">
              Password should be over seven characters and have at least one
              uppercase letter
            </Form.Text>
          </Form.Group>
        </>
      )}

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </fieldset>
  </Form>
);

export default AuthForm;
