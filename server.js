const express = require("express");
const projectRouter = require("./routers/projectRouter");
const actionRouter = require("./routers/actionRouter");

const server = express();

server.use(express.json());

server.use("/projects", projectRouter);
server.use("/actions", actionRouter);

//error middleware//
server.use((err, req, res, next) => {
  console.log(err);

  res.status(500).json({
    message: "Something went wrong, please try again later",
  });
});

module.exports = server;
