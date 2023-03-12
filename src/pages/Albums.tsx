import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StateProps } from "../utils/types";

import { AppDispatch } from "../redux/store";

import { fetchAlbums } from "../redux/reducers/albumsSlice";

const Albums = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    albums: { data, error, message, loading, pages },
    filter,
  } = useSelector((state: StateProps) => state);

  useEffect(() => {
    const shouldFetch = data === null && !loading && !error;
    shouldFetch &&
      (async () => {
        dispatch(fetchAlbums(filter));
      })();
  }, [data]);

  return <h2>albums</h2>;
};

export default Albums;
