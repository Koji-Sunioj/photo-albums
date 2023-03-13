import { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { setFilter } from "../redux/reducers/filterSlice";
import { fetchAlbums } from "../redux/reducers/albumsSlice";
import { StateProps, FilterStateProps, AppDispatch } from "../utils/types";

import AlbumList from "../components/AlbumList";
import AlbumQuery from "../components/AlbumQuery";
import AlbumsSkeletons from "../components/AlbumsSkeletons";
import AlbumsPagination from "../components/AlbumsPagination";

const Albums = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [fetchFlag, setFetchFlag] = useState("idle");
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    albums: { data, error, message, loading, pages, tags },
    filter,
  } = useSelector((state: StateProps) => state);

  let queryParams: FilterStateProps = {
    page: searchParams.get("page") || "1",
    direction: searchParams.get("direction") || "descending",
    sort: searchParams.get("sort") || "created",
    type: searchParams.get("type") || "text",
  };
  let query = searchParams.get("query") || "";
  if (query.length > 0) {
    queryParams.query = query;
  }

  useEffect(() => {
    if (
      JSON.stringify(queryParams) !== JSON.stringify(filter) ||
      (data === null && !loading && !error)
    ) {
      setSearchParams(queryParams);
      dispatch(setFilter(queryParams));
      dispatch(fetchAlbums(queryParams));
    }
  }, [searchParams, filter, data, fetchFlag]);

  const mutateParams = (newValues: {}, origin: null | string = null) => {
    Object.assign(queryParams, newValues);

    const shoulResetQuery =
      origin === "radio" && queryParams.hasOwnProperty("query");

    if (shoulResetQuery) {
      delete queryParams.query;
      queryParams.page = "1";
    }

    setSearchParams(queryParams);
    // console.log(queryParams);
  };

  const shouldRender = data !== null && data.length > 0;
  const shouldLoad = data === null && loading;
  const shouldNoQuery = data !== null && data.length === 0;

  return (
    <>
      <AlbumQuery filter={filter} mutateParams={mutateParams} />
      {shouldLoad && <AlbumsSkeletons />}
      {shouldNoQuery && <h3>No Albums match that query</h3>}
      {shouldRender && (
        <>
          <AlbumList albums={data} query={query} mutateParams={mutateParams} />
          <AlbumsPagination
            pages={pages!}
            filter={filter}
            mutateParams={mutateParams}
          />
        </>
      )}
    </>
  );
};

export default Albums;
