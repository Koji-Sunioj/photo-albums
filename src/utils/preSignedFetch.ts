import { getApi } from "./getApi";

export const getSignedUrl = async (payload: {
  name: string;
  type: string;
  AccessToken: string;
}) => {
  const preSignedApi = getApi("AlbumInitUrl");
  const { name, type, AccessToken } = payload;
  const url = await fetch(preSignedApi + `?key=${name}&content_type=${type}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${AccessToken}` },
  }).then((response) => response.json());
  return url;
};
