export const applyQueryOptions = (rows, query) => {
  let result = [...rows];
  if (query._sort) result.sort((a, b) => (a[query._sort] > b[query._sort] ? 1 : -1));
  if (query._limit) result = result.slice(0, Number(query._limit));
  if (query._page && query._limit) {
    const page = Number(query._page) - 1;
    const limit = Number(query._limit);
    result = result.slice(page * limit, page * limit + limit);
  }
  return result;
};
