import { Link } from "react-router-dom";
import { TAlbumCarouselProps } from "../utils/types";

import moment from "moment";

import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/esm/Stack";
import Button from "react-bootstrap/esm/Button";
import Carousel from "react-bootstrap/Carousel";

const AlbumCarousel = ({ album, removeAlbum }: TAlbumCarouselProps) => {
  const { title, created, photos, tags, userName } = album;

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
    </>
  );
};

export default AlbumCarousel;
