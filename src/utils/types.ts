export type childrenProps = {
  children: JSX.Element[];
};

export type apisProps = {
  [index: string]: string;
};

export type AlbumStateProps = {
  data: {}[];
  pages: number;
  error: boolean;
  message: string;
  loading: boolean;
};

export type FilterStateProps = {
  page: number;
  direction: string;
  sort: string;
  type: string;
};
export type StateProps = {
  albums: AlbumStateProps;
  filter: FilterStateProps;
};
