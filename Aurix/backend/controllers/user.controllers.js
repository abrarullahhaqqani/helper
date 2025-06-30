import User from "../models/user.model.js";

import uploadonCloudinary from "../config/cloudinary.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(500).json({
      message: " Internal user error",
      error: error.message,
    });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;

    console.log("UpdateAssistant BODY:", req.body);
    console.log("UpdateAssistant FILE:", req.file);
    console.log("UpdateAssistant USER ID:", req.userId);

    let assistantImage;

    //if input image is given then
    if (req.file) {
      //Cloudinary will give a URL of image and that is what is stored in this variable
      assistantImage = await uploadonCloudinary(req.file.path);

      //GPT
      // if (!assistantImage) {
      //   return res.status(500).json({
      //     message: "Image upload to Cloudinary failed",
      //   });
      // }
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");

    //we wont show password

    return res.status(200).json(user);
  } catch (error) {
    //GPT
    // console.error("🔥 UpdateAssistant ERROR:", error);

    return res.status(400).json({
      message: " Update Assistant Error ",
      // error: error.message GPT
    });
  }
};
