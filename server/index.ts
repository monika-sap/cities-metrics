import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
const asyncHandler = require("express-async-handler");
const utils = require("./utils.js");

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get(
  "/api/cities",
  asyncHandler(async (req: Request, res: Response) => {
    const { fileType, fileName } = req.query;

    let headerFileType = req.get("Content-Type");
    headerFileType = headerFileType?.slice(headerFileType?.indexOf("/") + 1);

    try {
      const data = await utils.getData(
        fileName || "cities",
        fileType || headerFileType
      );
      res.json(data);
    } catch ({ message }: any) {
      res.send(`${message}`);
    }
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
