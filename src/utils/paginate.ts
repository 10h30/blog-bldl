export const DEFAULT_PAGE_SIZE = 6;

export interface PageMeta {
  data: unknown[];
  total: number;
  currentPage: number;
  lastPage: number;
  url: { prev?: string; next?: string };
}

/**
 * Returns paginated static paths using WordPress-style /page/{n} URLs.
 *
 * @param items    Full sorted list of items to paginate.
 * @param basePath Base URL without trailing slash, e.g. "/blog" or "/category/travel".
 * @param pageSize Number of items per page (default: DEFAULT_PAGE_SIZE).
 * @returns        Array of { params: { page }, props: { page: PageMeta } }.
 */
export function buildPaginatedPaths<T>(
  items: T[],
  basePath: string,
  pageSize = DEFAULT_PAGE_SIZE,
) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  return Array.from({ length: totalPages }, (_, i) => {
    const pageNum = i + 1;
    const data = items.slice(i * pageSize, (i + 1) * pageSize);

    const prev =
      pageNum === 1
        ? undefined
        : pageNum === 2
          ? basePath
          : `${basePath}/page/${pageNum - 1}`;
    const next =
      pageNum === totalPages ? undefined : `${basePath}/page/${pageNum + 1}`;

    return {
      // page param: undefined for page 1 (matches the base URL), "page/N" for N≥2
      pageParam: pageNum === 1 ? undefined : `page/${pageNum}`,
      page: {
        data,
        total: items.length,
        currentPage: pageNum,
        lastPage: totalPages,
        url: { prev, next },
      } as PageMeta & { data: T[] },
    };
  });
}
