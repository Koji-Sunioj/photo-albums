import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";

const filler = {
  backgroundColor: "lightgrey",
  width: "20vw",
  borderRadius: "10px",
};

const AlbumSkeleton = () => (
  <>
    <h2>&nbsp;</h2>
    <Carousel
      style={{ backgroundColor: "black", animation: "fadeIn 0.5s" }}
      interval={null}
      className="mb-3"
      indicators={false}
      controls={false}
    >
      <Carousel.Item>
        <img
          src={"https://via.placeholder.com/400x400.png?text=Loading"}
          className="carousel-img"
        />
        <Carousel.Caption>
          <p style={filler}>&nbsp;</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    <Card.Subtitle className="mb-2 text-muted" style={filler}>
      &nbsp;
    </Card.Subtitle>
    <Card.Text style={filler}>&nbsp;</Card.Text>
  </>
);

export default AlbumSkeleton;
