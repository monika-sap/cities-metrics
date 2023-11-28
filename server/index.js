const express = require("express");
const asyncHandler = require("express-async-handler");
const utils = require("./utils.js");

const app = express();
const port = 3000;

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get(
  "/api/cities",
  asyncHandler(async (req, res) => {
    const { fileType, fileName } = req.query;

    let headerFileType = req.get("Content-Type");
    headerFileType = headerFileType?.slice(headerFileType?.indexOf("/") + 1);

    try {
      const data = await utils.getData(
        fileName || "cities",
        fileType || headerFileType
      );
      res.json(data);
    } catch ({ message }) {
      res.send(`${message}`);
    }
  })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = server;