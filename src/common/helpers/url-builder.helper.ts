export const buildPaginationUrl = (
  baseUrl: string,
  pathname: string,
  limit: number,
  page: number,
): string => {
  return `${baseUrl}${pathname}?limit=${limit}&page=${page}`;
};
