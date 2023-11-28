const request = require("supertest");
const fs = require("fs");
const app = require("../dist/index.js");
const { sortableFields, SortDirection } = require("../dist/types.js");

const getAllSortings = () => {
  const sortDirections = Object.values(SortDirection).filter((v) =>
    isNaN(Number(v))
  );

  const allSortings = [];

  sortableFields.forEach((sort) => {
    sortDirections.forEach((order) => {
      allSortings.push({
        sort,
        order,
      });
    });
  });

  return allSortings;
};

describe("GET /api/cities", () => {
  it("should receive correct result", () => {
    return request(app)
      .get("/api/cities")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(215);

        fs.readFile("tests/results.json", function (err, data) {
          if (err) {
            throw new Error(err);
          }
          expect(res.body).toMatchObject(JSON.parse(data));
        });
      });
  });

  it.each(getAllSortings())(
    "should receive correct sorted data by %p",
    async ({ sort, order }) => {
      return request(app)
        .get(`/api/cities?sort=${sort}&order=${order}`)
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.length).toBe(215);

          fs.readFile(
            `tests/sortedResults-${sort}-${order}.json`,
            function (err, data) {
              if (err) {
                throw new Error(err);
              }
              expect(res.body).toMatchObject(JSON.parse(data));
            }
          );
        });
    }
  );
});
