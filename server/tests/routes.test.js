const { getRequest, getAllSortings, filteringStrings } = require("./utils.js");

describe("GET /api/cities", () => {
  const ENDPOINT = "/api/cities";

  it("should receive correct result", () =>
    getRequest(ENDPOINT, "default", 215));

  it.each(getAllSortings())(
    "should receive correct sorted data by %p",
    async ({ sort, order }) =>
      getRequest(ENDPOINT, "sorting", 215, { sort, order })
  );

  it.each(filteringStrings)(
    "should receive correct result when filtering %p",
    ({ nameContains, lengthOfResult }) =>
      getRequest(ENDPOINT, "filtering", lengthOfResult, { nameContains })
  );
});
