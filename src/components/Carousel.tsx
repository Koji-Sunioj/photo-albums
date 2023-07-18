import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteAlbum } from "../redux/reducers/albumSlice";
import { TAlbumCarouselProps, AppDispatch } from "../utils/types";

import moment from "moment";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Stack from "react-bootstrap/esm/Stack";
import Button from "react-bootstrap/esm/Button";
import Carousel from "react-bootstrap/Carousel";
import { resetAlbums } from "../redux/reducers/albumsSlice";

const AlbumCarousel = ({
  album,
  auth,
  mutateState,
  loading,
  message,
}: TAlbumCarouselProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { title, created, photos, tags, userName } = album;

  const removeAlbum = () => {
    dispatch(
      deleteAlbum({ albumId: album.albumId, AccessToken: auth.AccessToken! })
    );
    dispatch(resetAlbums());
  };

  return (
    <>
      <h2>{title}</h2>
      <Carousel
        indicators={photos.length > 1}
        controls={photos.length > 1}
        style={{ backgroundColor: "black" }}
        interval={null}
        className="mb-3"
      >
        {photos.map((photo) => {
          const { url, text, order } = photo;
          return (
            <Carousel.Item key={order}>
              <img alt={text} src={url} className="carousel-img" />
              <Carousel.Caption>
                <p>{text}</p>
              </Carousel.Caption>
            </Carousel.Item>
          );
        })}
      </Carousel>
      <Card.Subtitle className="mb-2 text-muted">
        {moment(created).format("MMMM Do YYYY, H:mm")}
      </Card.Subtitle>
      <Card.Text>{userName}</Card.Text>
      <Stack direction="horizontal" gap={3} className="mb-3">
        {tags.map((tag) => (
          <Link
            to={`/albums?page=1&direction=descending&sort=created&query=${tag}&type=tags`}
            key={tag}
          >
            <Button variant="info" key={tag}>
              {tag}
            </Button>{" "}
          </Link>
        ))}
      </Stack>
      {auth.userName === userName && (
        <>
          <h3>options</h3>
          <Stack direction="horizontal" gap={3} className="mb-3">
            <Button
              variant="danger"
              onClick={removeAlbum}
              disabled={loading || mutateState === "deleted"}
            >
              Delete Album
            </Button>
            <Link to={`/albums/edit/${album.albumId}`}>
              <Button
                variant="primary"
                disabled={loading || mutateState === "deleted"}
              >
                Edit Album
              </Button>
            </Link>
          </Stack>
          <Row>
            <Col lg="6">
              {mutateState === "deleted" && (
                <Alert variant={"success"}>{message}</Alert>
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default AlbumCarousel;
