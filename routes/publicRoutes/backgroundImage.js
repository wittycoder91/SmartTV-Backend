const express = require("express");
const backgroundImageRouter = express.Router();
const backgroundImageCtrl = require("../../controllers/backgroundImageCtrl");

// GET /api/background-image
backgroundImageRouter.get("/", async (req, res) => {
  try {
    const result = await backgroundImageCtrl.getBackgroundImage();
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: `API error: ${error.message}` 
    });
  }
});

// POST /api/background-image/upload
backgroundImageRouter.post("/upload", backgroundImageCtrl.upload.single('background'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No background image uploaded"
      });
    }

    const result = await backgroundImageCtrl.uploadBackgroundImage(req.file);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: `API error: ${error.message}` 
    });
  }
});

// DELETE /api/background-image
backgroundImageRouter.delete("/", async (req, res) => {
  try {
    const result = await backgroundImageCtrl.deleteBackgroundImage();
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: `API error: ${error.message}` 
    });
  }
});

module.exports = backgroundImageRouter;
