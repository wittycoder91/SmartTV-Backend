const { getImagesCollection } = require("../helpers/db-conn");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/images";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '_' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get all images organized by category
const getImages = async () => {
  try {
    const collection = getImagesCollection();
    const images = await collection.findOne({});
    
    if (!images) {
      return {
        success: true,
        data: {}
      };
    }
    
    const cleanData = {
      menu: images.menu || [],
      lunch: images.lunch || [],
      coffee: images.coffee || [],
      wine: images.wine || []
    };
    
    return {
      success: true,
      data: cleanData
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Upload images
const uploadImages = async (files, category) => {
  try {
    const collection = getImagesCollection();
    const imageUrls = [];
    
    for (const file of files) {
      const imageUrl = `/uploads/images/${file.filename}`;
      imageUrls.push(imageUrl);
    }
    
    // Get existing images for the category
    const existingImages = await collection.findOne({});
    const currentImages = existingImages ? existingImages[category] || [] : [];
    
    // Add new images to the category
    const updatedImages = [...currentImages, ...imageUrls];
    const updateData = {
      [category]: updatedImages
    };
    
    if (!existingImages) {
      updateData.menu = category === 'menu' ? updatedImages : [];
      updateData.lunch = category === 'lunch' ? updatedImages : [];
      updateData.coffee = category === 'coffee' ? updatedImages : [];
      updateData.wine = category === 'wine' ? updatedImages : [];
    }
    
    await collection.updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    );
    
    return {
      success: true,
      message: "Images uploaded successfully",
      data: {
        category,
        uploadedUrls: imageUrls,
        totalImages: updatedImages.length
      }
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Update images for a specific category
const updateImages = async (category, imageUrls) => {
  try {
    const collection = getImagesCollection();
    
    const validCategories = ['menu', 'lunch', 'coffee', 'wine'];
    if (!validCategories.includes(category)) {
      return {
        success: false,
        message: "Invalid category. Must be one of: menu, lunch, coffee, wine"
      };
    }
    
    const existingImages = await collection.findOne({});
    
    const updateData = {
      [category]: imageUrls
    };
    
    if (!existingImages) {
      updateData.menu = category === 'menu' ? imageUrls : [];
      updateData.lunch = category === 'lunch' ? imageUrls : [];
      updateData.coffee = category === 'coffee' ? imageUrls : [];
      updateData.wine = category === 'wine' ? imageUrls : [];
    }
    
    await collection.updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    );
    
    return {
      success: true,
      message: `Images updated successfully for category: ${category}`,
      data: {
        category,
        imageUrls,
        totalImages: imageUrls.length
      }
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Delete image
const deleteImage = async (imageUrl, category) => {
  try {
    const collection = getImagesCollection();
    
    const existingImages = await collection.findOne({});
    if (!existingImages || !existingImages[category]) {
      return {
        success: false,
        message: "Category not found or no images exist"
      };
    }
    
    const updatedImages = existingImages[category].filter(url => url !== imageUrl);
    
    await collection.updateOne(
      {},
      { $set: { [category]: updatedImages } }
    );
    
    return {
      success: true,
      message: "Image deleted successfully",
      data: {
        category,
        remainingImages: updatedImages.length
      }
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

module.exports = {
  getImages,
  uploadImages,
  updateImages,
  deleteImage,
  upload
};
