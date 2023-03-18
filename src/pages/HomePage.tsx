import { useLocation } from "react-router-dom";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

const HomePage = () => {
  const { state } = useLocation();
  const shouldMessage = state !== null && state.hasOwnProperty("variant");

  console.log(state);

  return (
    <Row>
      <Col lg="6">
        <h1>Welcome</h1>
        <p>
          This is the home page. We make really sturdy Finnish things. All day
          errday.
        </p>
        {shouldMessage && <Alert variant={state.variant}>{state.value}</Alert>}
      </Col>
    </Row>
  );
};

export default HomePage;
