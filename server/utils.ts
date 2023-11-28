const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");

const computeDensity = (population: number, area: number) => {
  const density = population / (area * 2.58999);
  return Number(density.toFixed(2));
};

const enrich = (city: any) => ({
  ...city,
  density: computeDensity(Number(city.population), Number(city.area)),
});

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
  const parsedData = JSON.parse(data);
  const enrichedData = parsedData.map((city: any) => enrich(city));
  return enrichedData;
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

  let results: any = [];

  return new Promise((resolve, reject) =>
    fs
      .createReadStream(filePath)
      .on("error", (error: Error) => reject(error))
      .pipe(csvParser(newOptions))
      .on("error", (error: Error) => reject(error))
      .on("data", (city: any) => results.push(enrich(city)))
      .on("end", () => resolve(results))
  );
};

module.exports = {
  getData,
};
