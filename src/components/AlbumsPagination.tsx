import { AlbumPaginationProps } from "../utils/types";

import Pagination from "react-bootstrap/Pagination";

const AlbumsPagination = ({
  filter,
  pages,
  mutateParams,
}: AlbumPaginationProps) => {
  const { page } = filter;
  const pagesMap = new Array(Number(pages))
    .fill(null)
    .map((v, n) => String(n + 1));

  return (
    <Pagination>
      {pagesMap.length > 0 &&
        pagesMap.map((number) => (
          <Pagination.Item
            key={number}
            active={number === page}
            onClick={() => {
              mutateParams({ page: number });
              window.scrollTo(0, 0);
            }}
          >
            {number}
          </Pagination.Item>
        ))}
    </Pagination>
  );
};

export default AlbumsPagination;
