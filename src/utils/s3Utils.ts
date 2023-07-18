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

export const deleteObject = async (payload: {
  AccessToken: string;
  albumId: string;
  s3Object: string;
}) => {
  const albumApi = getApi("AlbumEndpoint");
  const { albumId, AccessToken, s3Object } = payload;
  const statusCode = await fetch(`${albumApi}albums/${albumId}/${s3Object}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${AccessToken}` },
  }).then((response) => response.status);
  return statusCode;
};
