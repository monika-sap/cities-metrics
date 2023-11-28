const request = require("supertest");
const fs = require("fs");
const app = require("../dist/index.js");

describe("GET /api/cities", () => {
  it("should receive correct result", async () => {
    return request(app)
      .get("/api/cities")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(215);

        fs.readFile("data/cities/cities.json", function (err, data) {
          if (err) {
            throw new Error(err);
          }
          expect(res.body).toMatchObject(JSON.parse(data));
        });
      });
  });
});
