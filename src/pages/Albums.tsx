import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

import * as React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setFilter } from "../redux/reducers/filterSlice";
import { fetchAlbums } from "../redux/reducers/albumsSlice";
import {
  StateProps,
  FilterStateProps,
  AppDispatch,
  ButtonRef,
} from "../utils/types";

import AlbumList from "../components/AlbumList";
import AlbumQuery from "../components/AlbumQuery";
import AlbumsSkeletons from "../components/AlbumsSkeletons";
import AlbumsPagination from "../components/AlbumsPagination";

const Albums = () => {
  // const queryRef = useRef<ButtonRef>(null);
  const dispatch = useDispatch<AppDispatch>();
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

  const { page, direction, sort, type } = queryParams;

  /*
  if a user changes a filter, the state should:
    update the query params
    update the albums
    and the filter


  */

  useEffect(() => {
    const isMutated = ["page", "direction", "sort", "query"].some(
      (item) =>
        queryParams[item as keyof FilterStateProps] !==
        filter[item as keyof FilterStateProps]
    );
    if (data === null && !loading && !error) {
      setSearchParams(queryParams);
      dispatch(setFilter(queryParams));
      dispatch(fetchAlbums(queryParams));
    } else if (isMutated) {
      dispatch(setFilter(queryParams));
      dispatch(fetchAlbums(queryParams));
    } else if (queryParams.type !== filter.type) {
      dispatch(setFilter(queryParams));
    }
  }, [searchParams, filter, data]);

  const mutateParams = (newValues: {}, origin: null | string = null) => {
    Object.assign(queryParams, newValues);
    const shoulResetQuery =
      origin === "radio" && queryParams.hasOwnProperty("query");
    if (shoulResetQuery) {
      delete queryParams.query;
      queryParams.page = "1";
    }
    setSearchParams(queryParams);
  };

  const createQuery = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      currentTarget: {
        filter: { value },
      },
    } = event;
    switch (type) {
      case "text":
        mutateParams({ query: value, page: 1 });
        break;
      // case "tags":
      //   const refined = query.length > 0 ? `${query},${filter}` : filter;
      //   document.getElementById("filter").value = "";
      //   queryRef.current.setAttribute("disabled", true);
      //   mutateParams({ query: refined, page: 1 });
      //   break;
      default:
        return null;
    }
  };
  const shouldRender = data !== null && data.length > 0;
  const shouldLoad = data === null && loading;
  const shouldNoQuery = data !== null && data.length === 0;

  return (
    <>
      <AlbumQuery
        // queryRef={queryRef}
        filter={filter}
        mutateParams={mutateParams}
        createQuery={createQuery}
      />
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
