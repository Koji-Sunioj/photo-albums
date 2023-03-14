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
  // ButtonRef,
} from "../utils/types";

import Button from "react-bootstrap/esm/Button";
import AlbumList from "../components/AlbumList";
import AlbumQuery from "../components/AlbumQuery";
import AlbumsSkeletons from "../components/AlbumsSkeletons";
import AlbumsPagination from "../components/AlbumsPagination";

const Albums = () => {
  const queryRef = useRef<HTMLButtonElement>(null);
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
    // console.log(queryParams);
    // console.log(filter);

    if (data === null && !loading && !error) {
      setSearchParams(queryParams);
      dispatch(setFilter(queryParams));
      dispatch(fetchAlbums(queryParams));
    } else if (isMutated) {
      console.log("mutated effecting");
      console.log("new params ", queryParams);
      console.log("old filter ", filter);
      dispatch(setFilter(queryParams));
      dispatch(fetchAlbums(queryParams));
    } else if (queryParams.type !== filter.type) {
      console.log("query effecting");

      if (
        !queryParams.hasOwnProperty("query") &&
        filter.hasOwnProperty("query")
      ) {
        dispatch(fetchAlbums(queryParams));
      }

      console.log("new params ", queryParams);
      console.log("old filter ", filter);
      dispatch(setFilter(queryParams));
    }
  }, [searchParams, filter, data]);

  const mutateParams = (
    newValues: { query?: string | null; page?: number },
    origin: null | string = null
  ) => {
    // if (newValues.query === null) {
    //   delete newValues.query;
    //   delete queryParams.query;
    // }

    console.log("mutating");
    Object.assign(queryParams, newValues);
    const shoulResetQuery =
      origin === "radio" && queryParams.hasOwnProperty("query");
    const hasQuery = tags?.includes(query);
    if (shoulResetQuery && !hasQuery) {
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

  const searchDisable = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    if (value.length === 0) {
      queryRef.current!.setAttribute("disabled", "true");
      if (query.length > 0) {
        delete queryParams.query;
        console.log("deleting query");
        mutateParams({ page: 1 });
        // dispatch(setFilter(queryParams));
      }
    } else {
      queryRef.current!.removeAttribute("disabled");
    }
  };

  const shouldRender = data !== null && data.length > 0;
  const shouldLoad = data === null && loading;
  const shouldNoQuery = data !== null && data.length === 0;

  return (
    <>
      <AlbumQuery
        queryRef={queryRef}
        filter={filter}
        mutateParams={mutateParams}
        createQuery={createQuery}
        searchDisable={searchDisable}
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
