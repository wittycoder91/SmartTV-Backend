const { getButtonLabelsCollection } = require("../helpers/db-conn");

// Get button labels
const getButtonLabels = async () => {
  try {
    const collection = getButtonLabelsCollection();
    const labels = await collection.findOne({});
    
    if (!labels) {
      return {
        success: true,
        data: {}
      };
    }
    
    const cleanData = {
      menu: labels.menu || "",
      reservation: labels.reservation || "",
      lunch: labels.lunch || "",
      reviews: labels.reviews || "",
      coffee: labels.coffee || "",
      wine: labels.wine || ""
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

// Update button labels
const updateButtonLabels = async (labelsData) => {
  try {
    const collection = getButtonLabelsCollection();
    
    const cleanLabelsData = {
      menu: labelsData.menu || "",
      reservation: labelsData.reservation || "",
      lunch: labelsData.lunch || "",
      reviews: labelsData.reviews || "",
      coffee: labelsData.coffee || "",
      wine: labelsData.wine || ""
    };
    
    await collection.updateOne(
      {},
      { $set: cleanLabelsData },
      { upsert: true }
    );
    
    return {
      success: true,
      message: "Button labels updated successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

module.exports = {
  getButtonLabels,
  updateButtonLabels
};
