const express = require("express");
const imagesRouter = express.Router();
const imagesCtrl = require("../../controllers/imagesCtrl");

// GET /api/images
imagesRouter.get("/", async (req, res) => {
  try {
    const result = await imagesCtrl.getImages();
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: `API error: ${error.message}` 
    });
  }
});

// POST /api/images/upload
imagesRouter.post("/upload", imagesCtrl.upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded"
      });
    }

    const category = req.body.category;
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required"
      });
    }

    const result = await imagesCtrl.uploadImages(req.files, category);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: `API error: ${error.message}` 
    });
  }
});

// PUT /api/images
imagesRouter.put("/", async (req, res) => {
  try {
    const { category, imageUrls } = req.body;
    
    if (!category || !imageUrls || !Array.isArray(imageUrls)) {
      return res.status(400).json({
        success: false,
        message: "category and imageUrls array are required"
      });
    }

    const result = await imagesCtrl.updateImages(category, imageUrls);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: `API error: ${error.message}` 
    });
  }
});

// DELETE /api/images
imagesRouter.delete("/", async (req, res) => {
  try {
    const { imageUrl, category } = req.body;
    
    if (!imageUrl || !category) {
      return res.status(400).json({
        success: false,
        message: "imageUrl and category are required"
      });
    }

    const result = await imagesCtrl.deleteImage(imageUrl, category);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: `API error: ${error.message}` 
    });
  }
});

module.exports = imagesRouter;
