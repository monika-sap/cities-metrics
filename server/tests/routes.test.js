const { getRequest, getAllSortings, filteringStrings } = require("./utils.js");

describe("GET /api/cities", () => {
  const ENDPOINT = "/api/cities";

  it("should receive correct result", async () =>
    getRequest(ENDPOINT, "default", 215));

  it.each(getAllSortings())(
    "should receive correct sorted data by %p",
    async ({ sort, order }) =>
      getRequest(ENDPOINT, "sorting", 215, { sort, order })
  );

  it.each(filteringStrings)(
    "should receive correct result when filtering %p",
    async ({ nameContains, lengthOfResult }) =>
      getRequest(ENDPOINT, "filtering", lengthOfResult, { nameContains })
  );
});
