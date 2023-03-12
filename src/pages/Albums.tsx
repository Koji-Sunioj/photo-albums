import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StateProps } from "../utils/types";

import { AppDispatch } from "../redux/store";

import { fetchAlbums } from "../redux/reducers/albumsSlice";
import { useSearchParams, useLocation } from "react-router-dom";

const Albums = () => {
  const { state } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [, setSearchParams] = useSearchParams();
  const {
    albums: { data, error, message, loading, pages },
    filter,
  } = useSelector((state: StateProps) => state);

  let isFromSamePage = false;

  if (state !== null && state.hasOwnProperty("path")) {
    const { path } = state;
    isFromSamePage = path === "/albums";
  }

  useEffect(() => {
    const shouldFetch = data === null && !loading && !error;
    shouldFetch &&
      (async () => {
        setSearchParams(filter);
        dispatch(fetchAlbums(filter));
      })();
    isFromSamePage && setSearchParams(filter);
  }, [data, isFromSamePage]);

  return <h2>albums</h2>;
};

export default Albums;
