import { store } from "../redux/store";

export type StateType = typeof store.getState;
export type AppDispatch = typeof store.dispatch;

export type StateProps = {
  albums: AlbumStateProps;
  filter: FilterStateProps;
  filterToggle: NavBarToggleProps;
};

export type childrenProps = {
  children: JSX.Element[];
};

export type apisProps = {
  [index: string]: string;
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
};

export type mutateParamsProps = (newValues: {}, origin?: null | string) => void;

export type AlbumPaginationProps = {
  filter: FilterStateProps;
  pages: number;
  mutateParams: mutateParamsProps;
};
