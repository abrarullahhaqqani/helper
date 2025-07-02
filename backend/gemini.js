import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;

    if (!apiUrl) {
      throw new Error("❌ GEMINI_API_URL is not set in environment");
    }

    const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
You are not Google. You will now behave like a voice-enabled assistant. 
Your task is to understand the user's natural language input and respond with a JSON object like this:
{
  "type": "general" | "google_search" | "youtube_search" | "youtube_play" | "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" | "instagram_open" | "facebook_open" | "linkedin_open" | "weather-show",
  "userInput": "<original user input>",
  "response": "<a short spoken response to read out loud to the user>"
}
Instructions:
- "type": intent
- "userInput": original sentence
- "response": voice-friendly reply
- Use "${userName}" if someone asks who created you
- ONLY return JSON
User input: ${command}
`;

    const result = await axios.post(apiUrl, {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = result?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("❌ Gemini returned no response");

    return text;
  } catch (error) {
  console.error("🔥 Gemini API Error - Full:", {
    status: error?.response?.status,
    data: error?.response?.data,
    message: error.message
  });
  throw new Error("Gemini API failed");
}

};

export default geminiResponse;
