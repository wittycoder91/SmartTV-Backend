const express = require("express");
const publicRouter = express.Router();
const auth = require("./auth.js");
const buttonLabels = require("./buttonLabels.js");
const images = require("./images.js");
const backgroundImage = require("./backgroundImage.js");

publicRouter.use("/auth", auth);
publicRouter.use("/button-labels", buttonLabels);
publicRouter.use("/images", images);
publicRouter.use("/background-image", backgroundImage);

module.exports = publicRouter;
