const { getSettingCollection } = require("../helpers/db-conn");

const SettingsCtrl = () => {
  // Get settings
  const getSettings = async () => {
    try {
      const collection = getSettingCollection();
      const settings = await collection.findOne({});

      if (!settings) {
        // If no settings exist, return default settings
        const defaultSettings = {
          backgroundColor: "#ffffff",
          textColor: "#000000",
          fontFamily: "Postbook, sans-serif",
          logoWidth: 150,
          logoHeight: 100,
        };
        return {
          success: true,
          message: "Settings retrieved successfully!",
          data: defaultSettings,
        };
      }

      return {
        success: true,
        message: "Settings retrieved successfully!",
        data: {
          backgroundColor: settings.backgroundColor,
          textColor: settings.textColor,
          fontFamily: settings.fontFamily,
          logoWidth: settings.logoWidth,
          logoHeight: settings.logoHeight,
        },
      };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  // Update settings
  const updateSettings = async (settingsData) => {
    try {
      const collection = getSettingCollection();

      // Validate required fields
      if (
        !settingsData.backgroundColor ||
        !settingsData.textColor ||
        !settingsData.fontFamily
      ) {
        return {
          success: false,
          message:
            "All fields (backgroundColor, textColor, fontFamily) are required",
        };
      }

      // Find existing settings or create new one
      const existingSettings = await collection.findOne({});

      if (existingSettings) {
        // Update existing settings
        const result = await collection.updateOne(
          { _id: existingSettings._id },
          {
            $set: {
              backgroundColor: settingsData.backgroundColor,
              textColor: settingsData.textColor,
              fontFamily: settingsData.fontFamily,
              updatedAt: new Date(),
            },
          }
        );

        if (result.modifiedCount > 0) {
          return {
            success: true,
            message: "Settings updated successfully!",
            data: {
              backgroundColor: settingsData.backgroundColor,
              textColor: settingsData.textColor,
              fontFamily: settingsData.fontFamily,
            },
          };
        } else {
          return { success: false, message: "No changes made to settings" };
        }
      } else {
        // Create new settings
        const newSettings = {
          backgroundColor: settingsData.backgroundColor,
          textColor: settingsData.textColor,
          fontFamily: settingsData.fontFamily,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await collection.insertOne(newSettings);

        if (result.acknowledged) {
          return {
            success: true,
            message: "Settings created successfully!",
            data: {
              backgroundColor: settingsData.backgroundColor,
              textColor: settingsData.textColor,
              fontFamily: settingsData.fontFamily,
            },
          };
        } else {
          return { success: false, message: "Failed to create settings" };
        }
      }
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  // Upload logo
  const uploadLogo = async (imagePath) => {
    try {
      const collection = getSettingCollection();

      // Find existing settings or create new one
      const existingSettings = await collection.findOne({});

      if (existingSettings) {
        // Update existing settings with new logo
        const result = await collection.updateOne(
          { _id: existingSettings._id },
          {
            $set: {
              image: imagePath,
              updatedAt: new Date(),
            },
          }
        );

        if (result.modifiedCount > 0) {
          return {
            success: true,
            message: "Logo uploaded successfully!",
            data: { image: imagePath },
          };
        } else {
          return { success: false, message: "Failed to update logo" };
        }
      } else {
        // Create new settings with logo
        const newSettings = {
          image: imagePath,
          backgroundColor: "#ffffff",
          textColor: "#000000",
          fontFamily: "Postbook, sans-serif",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await collection.insertOne(newSettings);

        if (result.acknowledged) {
          return {
            success: true,
            message: "Logo uploaded successfully!",
            data: { image: imagePath },
          };
        } else {
          return { success: false, message: "Failed to upload logo" };
        }
      }
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  // Get logo
  const getLogo = async () => {
    try {
      const collection = getSettingCollection();
      const settings = await collection.findOne({});

      if (!settings || !settings.image) {
        return {
          success: true,
          message: "Logo retrieved successfully!",
          data: { image: "" },
        };
      }

      return {
        success: true,
        message: "Logo retrieved successfully!",
        data: { image: settings.image },
      };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  // Update logo size
  const updateLogoSize = async (logoWidth, logoHeight) => {
    try {
      const collection = getSettingCollection();
      const existingSettings = await collection.findOne({});

      if (existingSettings) {
        // Update existing settings with new logo size
        const result = await collection.updateOne(
          { _id: existingSettings._id },
          {
            $set: {
              logoWidth: logoWidth,
              logoHeight: logoHeight,
              updatedAt: new Date(),
            },
          }
        );

        if (result.modifiedCount > 0) {
          return {
            success: true,
            message: "Logo size updated successfully!",
            data: { logoWidth, logoHeight },
          };
        } else {
          return { success: false, message: "No changes made to logo size" };
        }
      } else {
        // Create new settings with logo size
        const newSettings = {
          logoWidth: logoWidth,
          logoHeight: logoHeight,
          backgroundColor: "#ffffff",
          textColor: "#000000",
          fontFamily: "Postbook, sans-serif",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await collection.insertOne(newSettings);

        if (result.acknowledged) {
          return {
            success: true,
            message: "Logo size created successfully!",
            data: { logoWidth, logoHeight },
          };
        } else {
          return { success: false, message: "Failed to create logo size" };
        }
      }
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  // Upload background
  const uploadBackground = async (imagePath) => {
    try {
      const collection = getSettingCollection();

      // Find existing settings or create new one
      const existingSettings = await collection.findOne({});

      if (existingSettings) {
        // Update existing settings with new background
        const result = await collection.updateOne(
          { _id: existingSettings._id },
          {
            $set: {
              backgroundImage: imagePath,
              updatedAt: new Date(),
            },
          }
        );

        if (result.modifiedCount > 0) {
          return {
            success: true,
            message: "Background uploaded successfully!",
            data: { backgroundImage: imagePath },
          };
        } else {
          return { success: false, message: "Failed to update background" };
        }
      } else {
        // Create new settings with background
        const newSettings = {
          backgroundImage: imagePath,
          backgroundColor: "#ffffff",
          textColor: "#000000",
          fontFamily: "Postbook, sans-serif",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await collection.insertOne(newSettings);

        if (result.acknowledged) {
          return {
            success: true,
            message: "Background uploaded successfully!",
            data: { backgroundImage: imagePath },
          };
        } else {
          return { success: false, message: "Failed to upload background" };
        }
      }
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  // Get background
  const getBackground = async () => {
    try {
      const collection = getSettingCollection();
      const settings = await collection.findOne({});

      if (!settings || !settings.backgroundImage) {
        return {
          success: true,
          message: "Background retrieved successfully!",
          data: { backgroundImage: "" },
        };
      }

      return {
        success: true,
        message: "Background retrieved successfully!",
        data: { backgroundImage: settings.backgroundImage },
      };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  return {
    getSettings,
    updateSettings,
    uploadLogo,
    getLogo,
    updateLogoSize,
    uploadBackground,
    getBackground,
  };
};

module.exports = SettingsCtrl();
