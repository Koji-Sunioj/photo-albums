import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { TAppState, AppDispatch } from "../utils/types";
import { fetchAlbum } from "../redux/reducers/albumSlice";

import AlbumCarousel from "../components/Carousel";

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

  const shouldRender = data !== null && data.albumId === albumId;

  return (
    <>
      {shouldRender && (
        <AlbumCarousel
          album={data}
          auth={auth}
          mutateState={mutateState}
          message={message}
          loading={loading}
        />
      )}
    </>
  );
};

export default Album;
