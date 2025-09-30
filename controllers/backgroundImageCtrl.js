const { getBackgroundImageCollection } = require("../helpers/db-conn");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for background image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/images/backgrounds";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'background_' + uniqueSuffix + path.extname(file.originalname));
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

const getBackgroundImage = async () => {
  try {
    const collection = getBackgroundImageCollection();
    const backgroundImage = await collection.findOne({});
    
    if (!backgroundImage) {
      return {
        success: true,
        data: ""
      };
    }
    
    const cleanData = {
      url: backgroundImage.url,
      uploadedAt: backgroundImage.uploadedAt
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

// Upload background image
const uploadBackgroundImage = async (file) => {
  try {
    const collection = getBackgroundImageCollection();
    const imageUrl = `/uploads/images/backgrounds/${file.filename}`;
    
    await collection.updateOne(
      {},
      { 
        $set: { 
          url: imageUrl,
          uploadedAt: new Date()
        } 
      },
      { upsert: true }
    );
    
    return {
      success: true,
      message: "Background image uploaded successfully",
      data: {
        url: imageUrl
      }
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Delete background image
const deleteBackgroundImage = async () => {
  try {
    const collection = getBackgroundImageCollection();
    
    const result = await collection.deleteOne({});
    
    if (result.deletedCount === 0) {
      return {
        success: false,
        message: "No background image found to delete"
      };
    }
    
    return {
      success: true,
      message: "Background image deleted successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

module.exports = {
  getBackgroundImage,
  uploadBackgroundImage,
  deleteBackgroundImage,
  upload
};
