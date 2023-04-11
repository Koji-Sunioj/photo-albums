import * as React from "react";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { setFilter } from "../redux/reducers/filterSlice";
import { fetchAlbums } from "../redux/reducers/albumsSlice";
import {
  TAppState,
  TFilterState,
  AppDispatch,
  TMutateParams,
} from "../utils/types";

import AlbumList from "../components/AlbumList";
import AlbumQuery from "../components/AlbumQuery";
import AlbumsSkeletons from "../components/AlbumsSkeletons";
import AlbumsPagination from "../components/AlbumsPagination";

const Albums = () => {
  const queryRef = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = useSelector((state: TAppState) => state.filter);
  const { data, error, message, loading, pages, tags } = useSelector(
    (state: TAppState) => state.albums
  );

  let queryParams: TFilterState = {
    page: searchParams.get("page") || "1",
    direction: searchParams.get("direction") || "descending",
    sort: searchParams.get("sort") || "created",
    type: searchParams.get("type") || "text",
  };
  let query = searchParams.get("query") || "";
  if (query.length > 0) {
    queryParams.query = query;
  }

  const { type } = queryParams;

  useEffect(() => {
    const isMutated = ["page", "direction", "sort", "query"].some(
      (item) =>
        queryParams[item as keyof TFilterState] !==
        filter[item as keyof TFilterState]
    );
    if (data === null && !loading && !error) {
      setSearchParams(queryParams);
      dispatch(setFilter(queryParams));
      dispatch(fetchAlbums(queryParams));
    } else if (isMutated) {
      dispatch(setFilter(queryParams));
      dispatch(fetchAlbums(queryParams));
    } else if (queryParams.type !== filter.type) {
      const queryMismatch =
        !queryParams.hasOwnProperty("query") && filter.hasOwnProperty("query");
      queryMismatch && dispatch(fetchAlbums(queryParams));
      dispatch(setFilter(queryParams));
    }
  });

  const mutateParams: TMutateParams = (newValues, origin) => {
    Object.assign(queryParams, newValues);
    const shoulResetQuery =
      origin === "radio" && queryParams.hasOwnProperty("query");
    const hasQuery = tags?.includes(query);

    if ((shoulResetQuery && !hasQuery) || queryParams.query === null) {
      delete queryParams.query;
      queryParams.page = "1";
    }
    setSearchParams(queryParams);
  };

  const searchDisable = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    const emptyInput = value.length === 0;
    emptyInput
      ? queryRef.current!.setAttribute("disabled", "true")
      : queryRef.current!.removeAttribute("disabled");

    if (query.length > 0 && emptyInput) {
      mutateParams({ query: null });
    }
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
        mutateParams({ query: value, page: "1" });
        break;
      case "tags":
        const refined = query.length > 0 ? `${query},${value}` : value;
        (document.getElementById("filter")! as HTMLButtonElement).value = "";
        queryRef.current!.setAttribute("disabled", "true");
        mutateParams({ query: refined, page: "1" });
        break;
      default:
        return null;
    }
  };

  const checkTags = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    value.length === 0 && queryRef.current!.setAttribute("disabled", "true");
    tags!.includes(value) && queryRef.current!.removeAttribute("disabled");
  };

  const removeTags = (tag: string) => {
    const currentQuery = query!.split(",");
    const index = currentQuery.indexOf(tag);
    currentQuery.splice(index, 1);
    let mutateObject: { page: string; query?: string | null } = { page: "1" };
    currentQuery.length === 0
      ? mutateParams({ ...mutateObject, query: null })
      : mutateParams({ ...mutateObject, query: currentQuery.join(",") });
  };

  const changeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { name, value },
    } = event;
    const newParam: { [index: string]: string } = {};
    newParam[name] = value;
    mutateParams(newParam);
  };

  const shouldLoad = data === null && loading;
  const shouldError = error && message!.length > 0;
  const shouldRender = data !== null && data.length > 0;
  const shouldNoQuery = data !== null && data.length === 0;

  console.log("rendered");

  return (
    <>
      <AlbumQuery
        changeSelect={changeSelect}
        checkTags={checkTags}
        queryRef={queryRef}
        filter={filter}
        mutateParams={mutateParams}
        createQuery={createQuery}
        searchDisable={searchDisable}
        loading={loading}
        removeTags={removeTags}
      />
      {shouldLoad && <AlbumsSkeletons />}
      {shouldNoQuery && <h3>No Albums match that query</h3>}
      {shouldError && <h3>{message}</h3>}
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
