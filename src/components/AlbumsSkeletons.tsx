import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";

const AlbumsSkeletons = () => (
  <Row>
    {[1, 2, 3, 4, 5, 6].map((row) => (
      <Col lg={4} key={row}>
        <Card className="mb-3" style={{ animation: "fadeIn 0.5s" }}>
          <Card.Img
            variant="top"
            style={{ backgroundColor: "grey" }}
            src={"https://via.placeholder.com/400x400.png?text=Loading"}
            height="300px"
            width="414px"
          />
          <Card.Body>
            <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
            <Placeholder as={Card.Subtitle} animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
            <Placeholder as={Card.Text} animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
);
export default AlbumsSkeletons;
