import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import { childrenProps } from "../utils/types";

const ContainerRowCol = ({ children }: childrenProps) => (
  <Container>
    <Row>
      <Col lg="6">{children}</Col>
    </Row>
  </Container>
);

export default ContainerRowCol;
