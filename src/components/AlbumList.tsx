import moment from "moment";
import { Link } from "react-router-dom";

import { TAlbumListProps } from "../utils/types";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/esm/Button";

const AlbumList = ({ albums, mutateParams, query }: TAlbumListProps) => {
  return (
    <Row>
      {albums.map((album) => {
        const photos = album.photos.sort((a, b) =>
          a.order > b.order ? 1 : b.order > a.order ? -1 : 0
        );
        const { albumId, title, tags, userName, photoLength } = album;
        const created = moment(album.created).format("MMMM Do YYYY, H:mm");

        return (
          <Col lg={4} key={albumId}>
            <Card className="mb-3">
              <Card.Img
                variant="top"
                src={photos[0].url}
                className="album-img"
                style={{ backgroundColor: "grey" }}
              />
              <Card.Body>
                <Link to={`/albums/${albumId}`}>
                  <Card.Title>{title}</Card.Title>
                </Link>
                <Card.Subtitle className="mb-2 text-muted">
                  {created}
                </Card.Subtitle>
                <Card.Text>
                  {photoLength} {photoLength === 1 ? "photo " : "photos "}
                  by {userName}
                </Card.Text>
                {tags.map((tag) => (
                  <Button
                    style={{
                      pointerEvents: query.split(",").includes(tag)
                        ? "none"
                        : "auto",
                      margin: "3px",
                    }}
                    variant="info"
                    key={tag}
                    onClick={() => {
                      const queryString =
                        query.length > 0 ? `${query},${tag}` : tag;
                      mutateParams({
                        query: queryString,
                        type: "tags",
                        page: "1",
                      });
                    }}
                  >
                    {tag}
                  </Button>
                ))}
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default AlbumList;
