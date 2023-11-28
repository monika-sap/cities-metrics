const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");

import { City, EnrichedCity, SortDirection, SortField } from "./types";

const computeDensity = (population: number, area: number) => {
  const density = population / (area * 2.58999);
  return Number(density.toFixed(2));
};

const enrich = (city: City) =>
  ({
    ...city,
    density: computeDensity(Number(city.population), Number(city.area)),
  } as EnrichedCity);

const getData = async (name: string, type = "json", encoding = "utf-8") => {
  if (type !== "json" && type !== "csv") {
    throw new Error("File Type not supported");
  }

  const fileName = `${name}.${type}`;
  const filePath = `data/${name}/${fileName}`;
  const fullPath = path.join(__dirname, `../${filePath}`);

  const parsers = {
    json: async () => await getJSONData(fullPath, encoding),
    csv: async () => await getCSVData(fullPath),
  };

  const data = await parsers[type]();
  return data;
};

const getJSONData = async (filePath: string, encoding = "utf-8") => {
  const data = await fs.promises.readFile(filePath, encoding);
  const parsedData = JSON.parse(data) as City[];
  const enrichedData = parsedData.map((city: City) => enrich(city));
  return enrichedData as EnrichedCity[];
};

const getCSVData = (
  filePath: string,
  options = {},
  overrideOptions = false
) => {
  const newOptions = overrideOptions
    ? options
    : {
        separator: ";",
        headers: ["name", "area", "population"],
        mapValues: ({ header, index, value }: any) => {
          return isNaN(value) ? value : Number(value);
        },
        skipLines: 1,
        ...options,
      };

  let results: EnrichedCity[] = [];

  return new Promise((resolve, reject) =>
    fs
      .createReadStream(filePath)
      .on("error", (error: Error) => reject(error))
      .pipe(csvParser(newOptions))
      .on("error", (error: Error) => reject(error))
      .on("data", (city: City) => results.push(enrich(city)))
      .on("end", () => resolve(results))
  );
};

const sortData = (
  data: EnrichedCity[],
  sortField: SortField,
  sortOrder: SortDirection
) => {
  return data.sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];

    if (typeof fieldA === "string") fieldA = fieldA.toLowerCase();
    if (typeof fieldB === "string") fieldB = fieldB.toLowerCase();

    const ascDirection = fieldA > fieldB ? 1 : -1;
    const descDirection = fieldA < fieldB ? 1 : -1;

    return sortOrder === SortDirection.DESC ? descDirection : ascDirection;
  });
};

module.exports = {
  getData,
  sortData,
};
