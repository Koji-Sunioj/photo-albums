import { store } from "../redux/store";

import * as React from "react";

export type StateType = typeof store.getState;
export type AppDispatch = typeof store.dispatch;

export type TAppState = {
  albums: TAlbumsState;
  album: TAlbumState;
  filter: TFilterState;
  filterToggle: TNavbarState;
  auth: TAuthState;
};

export type TFilterState = {
  page: string;
  direction: string;
  sort: string;
  type: string;
  query?: string;
};

export type TAlbumsState = {
  data: TAlbum[] | null;
  tags: string[] | null;
  pages: number | null;
  error: boolean;
  message: string | null;
  loading: boolean;
};

export type TAlbumState = {
  data: TAlbum | null;
  error: boolean;
  message: string | null;
  loading: boolean;
  mutateState: string;
};

export type TNavbarState = {
  toggleDisplay: boolean;
  filterDisplay: boolean;
};

export type TAuthState = {
  userName: null | string;
  AccessToken: null | string;
  expires: null | number;
  loading: boolean;
  message: null | { variant: string; value: string };
  patched: null | string;
  verified: boolean;
  counter: null | number;
};

export type TAlbum = {
  albumId: string;
  created: string;
  photoLength: number;
  photos: TPhoto[];
  tags: string[];
  title: string;
  userName: string;
};

export type TApiPointer = {
  [index: string]: string;
};

export type TPhoto = {
  url: string;
  order: number;
  text: string;
};

export type TAlbumListProps = {
  albums: TAlbum[];
  mutateParams: TMutateParams;
  query: string;
};

export type TAlbumQueryProps = {
  loading: boolean;
  filter: TFilterState;
  queryRef: React.RefObject<HTMLButtonElement>;
  removeTags: (tag: string) => void;
  mutateParams: TMutateParams;
  createQuery: (event: React.FormEvent<HTMLFormElement>) => void;
  checkTags: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchDisable: (event: React.ChangeEvent<HTMLInputElement>) => void;
  changeSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export type TAlbumSubmitProps = {
  title: string;
  tags: string[];
  previews: TPhotoFile[];
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  setCreateFlow: React.Dispatch<React.SetStateAction<string>>;
};

export type TAlbumPaginationProps = {
  filter: TFilterState;
  pages: number;
  mutateParams: TMutateParams;
};

export type TUploadCarouselProps = {
  index: number;
  editMode: boolean;
  previews: TPhotoFile[];
  reOrder: (order: number, position: string) => void;
  mutateCopy: (
    newValue: boolean | string,
    file: TPhotoFile,
    attribute: string
  ) => void;
  deletePicture: (file: TPhotoFile) => void;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
};

export type TAlbumFormProps = {
  previewMapping: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type TAlbumEditProps = {
  setCreateFlow: React.Dispatch<React.SetStateAction<string>>;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  startOver: () => void;
  editMode: boolean;
};

export type TPhotoFile = {
  name: string;
  type: string;
  file: File;
  blob: string;
  closed: boolean;
  text: null;
  order: number;
};

export type TMutateParams = (newValues: {}, origin?: null | string) => void;

export type TAlbumCarouselProps = {
  album: TAlbum;
  auth: TAuthState;
  mutateState: string;
  message: string | null;
  loading: boolean;
};
