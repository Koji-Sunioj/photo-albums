import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { TAppState, AppDispatch } from "../utils/types";
import { fetchAlbum } from "../redux/reducers/albumSlice";

import AlbumCarousel from "../components/Carousel";

const Album = () => {
  const { albumId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    album: { data, error, loading, message },
  } = useSelector((state: TAppState) => state);

  const shouldFetch =
    (data === null && !error && !loading) ||
    (data !== null && data.albumId !== albumId && !error && !loading);

  useEffect(() => {
    shouldFetch && dispatch(fetchAlbum(albumId!));
  });

  const shouldRender = data !== null && data.albumId === albumId;

  return <>{shouldRender && <AlbumCarousel album={data} />}</>;
};

export default Album;
