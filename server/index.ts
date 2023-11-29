import express, { Express, NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import { getData, sortData, saveEntry } from "./utils.js";
import { SortDirection, City, EnrichedCity, CitiesQueryParams } from "./types";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get(
  "/api/cities",
  asyncHandler(async (req: Request, res: Response) => {
    const { fileType, fileName, sort, order, nameContains }: CitiesQueryParams =
      req.query;

    let headerFileType = req.get("Content-Type");
    headerFileType = headerFileType?.slice(headerFileType?.indexOf("/") + 1);

    let data: EnrichedCity[] = [];
    try {
      data = (await getData(
        fileName || "cities",
        fileType || headerFileType
      )) as EnrichedCity[];
    } catch ({ message }: any) {
      res.send(`${message}`);
    }

    if (!!sort) {
      data = sortData(data, sort, order || SortDirection.ASC);
    }

    if (!!nameContains) {
      const filterText = nameContains.toLowerCase();
      data = data.filter(({ name }: City) =>
        name.toLowerCase().includes(filterText)
      );
    }

    res.json(data);
  })
);

app.use(bodyParser.json());

app.post(
  "/api/cities/add",
  asyncHandler(async (req: Request, res: Response) => {
    const { name, population, area } = req.body;

    if (!name || !population || !area) {
      res.status(400).send("Missing required fields");
      return;
    }

    const newCity = { name, population, area } as City;
    await saveEntry(newCity);

    res.status(201).send("Entry added");
  })
);

app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

module.exports = server;
