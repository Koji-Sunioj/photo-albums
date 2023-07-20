import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

import { TAppState } from "./types";

export const RemoveSlash = () => {
  const { filter } = useSelector((state: TAppState) => state);
  const currentLocation = useLocation();
  const { pathname } = currentLocation;
  const filterString = Object.entries(filter)
    .map((thing) => thing.join("="))
    .join("&");

  if (pathname === "/albums/") {
    return (
      <Navigate
        to={{
          pathname: "/albums",
          search: filterString,
        }}
      />
    );
  } else return null;
};
