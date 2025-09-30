const express = require("express");
const buttonLabelsRouter = express.Router();
const buttonLabelsCtrl = require("../../controllers/buttonLabelsCtrl");

// GET /api/button-labels
buttonLabelsRouter.get("/", async (req, res) => {
  try {
    const result = await buttonLabelsCtrl.getButtonLabels();
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: `API error: ${error.message}` 
    });
  }
});

// PUT /api/button-labels
buttonLabelsRouter.put("/", async (req, res) => {
  try {
    const labelsData = req.body;
    const result = await buttonLabelsCtrl.updateButtonLabels(labelsData);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: `API error: ${error.message}` 
    });
  }
});

module.exports = buttonLabelsRouter;
