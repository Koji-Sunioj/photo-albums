import { Navigate, useLocation } from "react-router-dom";

import { StateProps } from "./types";
import { useSelector } from "react-redux";

export const RemoveSlash = () => {
  const { filter } = useSelector((state: StateProps) => state);
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
