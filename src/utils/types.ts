import { store } from "../redux/store";

import * as React from "react";

export type StateType = typeof store.getState;
export type AppDispatch = typeof store.dispatch;

export type StateProps = {
  albums: AlbumStateProps;
  filter: FilterStateProps;
  filterToggle: NavBarToggleProps;
  auth: AuthType;
};

export type childrenProps = {
  children: JSX.Element[];
};

export type apisProps = {
  [index: string]: string;
};

export type AuthType = {
  userName: null | string;
  AccessToken: null | string;
  expires: null | number;
  loading: boolean;
  error: boolean;
  message: null | { variant: string; value: string };
  patched: null | string;
  verified: boolean;
  counter: null | number;
};

export type AlbumType = {
  albumId: string;
  created: string;
  photoLength: number;
  photos: PhotoType[];
  tags: string[];
  title: string;
  userName: string;
};

export type PhotoType = {
  url: string;
  order: number;
  text: string;
};

export type AlbumStateProps = {
  data: AlbumType[] | null;
  tags: string[] | null;
  pages: number | null;
  error: boolean;
  message: string | null;
  loading: boolean;
};

export type FilterStateProps = {
  page: string;
  direction: string;
  sort: string;
  type: string;
  query?: string;
};

export type NavBarToggleProps = {
  toggleDisplay: boolean;
  filterDisplay: boolean;
};

export type AlbumListProps = {
  albums: AlbumType[];
  mutateParams: mutateParamsProps;
  query: string;
};

export type AlbumQueryProps = {
  filter: FilterStateProps;
  mutateParams: mutateParamsProps;
  createQuery: createQuery;
  queryRef: React.RefObject<HTMLButtonElement>;
  searchDisable: searchDisable;
  checkTags: searchDisable;
  loading: boolean;
  removeTags: removeTags;
  changeSelect: changeSelect;
};

export type searchDisable = (
  event: React.ChangeEvent<HTMLInputElement>
) => void;

export type changeSelect = (
  event: React.ChangeEvent<HTMLSelectElement>
) => void;

export type mutateParamsProps = (newValues: {}, origin?: null | string) => void;

export type createQuery = (event: React.FormEvent<HTMLFormElement>) => void;

export type removeTags = (tag: string) => void;

export type AlbumPaginationProps = {
  filter: FilterStateProps;
  pages: number;
  mutateParams: mutateParamsProps;
};
