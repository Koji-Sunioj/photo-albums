import { TPhotoFile } from "./types";

import { getSignedUrl, deleteObject } from "./s3Utils";

export const fileMapper = (defaultLength: number) => {
  return (file: File, i: number) => {
    return {
      name: file.name,
      type: file.type,
      file: file,
      blob: URL.createObjectURL(file),
      closed: true,
      text: null,
      order: defaultLength + i + 1,
    };
  };
};

export const deleteS3Mapper = (payload: {
  albumId: string;
  AccessToken: string;
}) => {
  const { albumId, AccessToken } = payload;
  return async (key: string) => {
    const statusCode = await deleteObject({
      s3Object: key,
      AccessToken: AccessToken,
      albumId: albumId,
    });
    return statusCode === 200;
  };
};

export const putS3Mapper = (payload: {
  albumId: string;
  AccessToken: string;
}) => {
  const { albumId, AccessToken } = payload;
  return async (item: TPhotoFile) => {
    const { name, type, file, text, order } = item;
    const newPath = `${albumId}/${name}`;
    const { url } = await getSignedUrl({
      name: newPath,
      type: type,
      AccessToken: AccessToken,
    });
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

export const previewMapper = (preview: {
  blob: string;
  text: string | null;
  order: number;
}) => {
  const { blob, text, order } = preview;
  return { url: blob, text: text, order: order };
};
