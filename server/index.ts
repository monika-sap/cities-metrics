import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { SortDirection } from "./types";
const asyncHandler = require("express-async-handler");
const utils = require("./utils.js");

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get(
  "/api/cities",
  asyncHandler(async (req: Request, res: Response) => {
    const { fileType, fileName, sort, order } = req.query;

    let headerFileType = req.get("Content-Type");
    headerFileType = headerFileType?.slice(headerFileType?.indexOf("/") + 1);

    let data = [];
    try {
      data = await utils.getData(
        fileName || "cities",
        fileType || headerFileType
      );
    } catch ({ message }: any) {
      res.send(`${message}`);
    }

    if (!!sort) {
      data = utils.sortData(
        data,
        sort,
        ((order as string) || "").toUpperCase() || SortDirection.ASC
      );
    }

    res.json(data);
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
