const request = require("supertest");
const fs = require("fs");
const path = require("path");
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

const filteringStrings = [
  {
    nameContains: "chi",
    lengthOfResult: 2,
  },
  {
    nameContains: "ChI",
    lengthOfResult: 2,
  },
  {
    nameContains: "!@",
    lengthOfResult: 0,
  },
  {
    nameContains: "",
    lengthOfResult: 215,
  },
];

const buildRequestUri = (endpoint, queryParams = {}) => {
  let uri = endpoint;

  const keys = Object.keys(queryParams);
  if (keys.length > 0) {
    uri += "?";
    uri += keys.map((key) => `${key}=${queryParams[key]}`).join("&");
  }

  return uri;
};

const buildFileName = (endpoint, type, queryParams = {}) => {
  let fileName = type;

  const keys = Object.keys(queryParams);
  if (keys.length > 0) {
    fileName += "-";
    fileName += keys
      .map((key) => `${key}_${queryParams[key].toLowerCase()}`)
      .join("-");
  }

  fileName += ".json";

  const filePath = `json/${endpoint}/${fileName}`;
  const fullPath = path.join(__dirname, filePath);

  console.log(fullPath);

  return fullPath;
};

const getRequest = (endpoint, type, lengthOfResult, queryParams) =>
  request(app)
    .get(buildRequestUri(endpoint, queryParams))
    .expect("Content-Type", /json/)
    .expect(200)
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(lengthOfResult);

      fs.readFile(
        buildFileName(endpoint, type, queryParams),
        function (err, data) {
          if (err) {
            throw new Error(err);
          }
          expect(res.body).toMatchObject(JSON.parse(data));
        }
      );
    });

module.exports = {
  getAllSortings,
  filteringStrings,
  getRequest,
};
