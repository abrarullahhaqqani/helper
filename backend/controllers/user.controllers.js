import User from "../models/user.model.js";
import geminiResponse from "../gemini.js";
import uploadonCloudinary from "../config/cloudinary.js";
import moment from "moment/moment.js";
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

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    const user = await User.findById(req.userId);

    user.history.push(command);
    await user.save();

    const userName = user.name;
    const assistantName = user.assistantName;
    const result = await geminiResponse(command, assistantName, userName);
    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({
        message: "Sorry, I can't understand",
      });
    }
    const gemResult = JSON.parse(jsonMatch[0]);
    const type = gemResult.type;
    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format("DD-MM-YYYY")}`,
        });
      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current time is ${moment().format("hh:mm A")}`,
        });
      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `today is ${moment().format("dddd")}`,
        });
      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `today is ${moment().format("MMMM")}`,
        });
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "general":
      case "calculator_open":
      case "facebook_open":
      case "instagram_open":
      case "linkedin_open":
      case "weather-show":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });
      default:
        return res.status(400).json({
          message: "Sorry, I can't understand",
        });
    }
  } catch (error) {
    console.error("🔥 AskToAssistant Error:", error);
return res.status(500).json({
  message: " Ask assistant error",
  error: error.message,
});

  }
};
