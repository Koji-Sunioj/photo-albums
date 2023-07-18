import { getSignedUrl } from "./preSignedFetch";

import { TPhotoFile } from "./types";

export const fileMapper = (file: File, i: number) => {
  return {
    name: file.name,
    type: file.type,
    file: file,
    blob: URL.createObjectURL(file),
    closed: true,
    text: null,
    order: i + 1,
  };
};

export const putS3Mapper = (albumIdToken: {
  albumId: string;
  AccessToken: string;
}) => {
  const { albumId, AccessToken } = albumIdToken;
  return async (item: TPhotoFile) => {
    const { name, type, file, text, order } = item;
    const newPath = `${albumId}/${name}`;
    const { url } = await getSignedUrl({
      name: newPath,
      type: type,
      AccessToken: AccessToken,
    });
    console.log(url);
    const response = await fetch(url, {
      method: "PUT",
      body: file,
    });
    const dynamoData = {
      url: response.url.split("?")[0],
      text: text,
      order: order,
      success: response.ok,
    };
    return dynamoData;
  };
};

export const responseMapper = (response: {
  url: string;
  text: string | null;
  order: number;
}) => {
  const { url, text, order } = response;
  return { url: url, text: text, order: order };
};
