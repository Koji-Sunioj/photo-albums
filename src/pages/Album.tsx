import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";

import { TAppState, AppDispatch } from "../utils/types";
import { fetchAlbum } from "../redux/reducers/albumSlice";
import { deleteAlbum } from "../redux/reducers/albumSlice";
import { resetAlbums } from "../redux/reducers/albumsSlice";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Stack from "react-bootstrap/esm/Stack";
import Button from "react-bootstrap/esm/Button";
import AlbumCarousel from "../components/AlbumCarousel";
import AlbumSkeleton from "../components/AlbumSkeleton";

const Album = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    album: { data, error, loading, mutateState, message },
    auth,
  } = useSelector((state: TAppState) => state);

  const shouldFetch =
    (data === null && !error && !loading) ||
    (data !== null && data.albumId !== albumId && !error && !loading);

  useEffect(() => {
    shouldFetch && dispatch(fetchAlbum(albumId!));
    mutateState === "deleted" &&
      setTimeout(() => {
        navigate("/albums");
      }, 2000);
  });

  const removeAlbum = () => {
    dispatch(
      deleteAlbum({ albumId: albumId!, AccessToken: auth.AccessToken! })
    );
    dispatch(resetAlbums());
  };

  const shouldRender = data !== null && data.albumId === albumId;
  const shouldOptions = shouldRender && auth.userName === data.userName;

  return (
    <>
      {loading && <AlbumSkeleton />}
      {shouldRender && <AlbumCarousel album={data} removeAlbum={removeAlbum} />}
      {shouldOptions && (
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
            <Link to={`/edit-album/${albumId}`}>
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

export default Album;
