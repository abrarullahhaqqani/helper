import axios from "axios";
const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;
    const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
    You are not Google. You will now behave like a voice-enabled assistant. 
    Your task is to understand the user's natural language input and respond with a JSON object like this:
    {
    "type":"general" |"google_search"|"youtube_search"|"youtube_play"|"get_time"|"get_date"|"get_day"|"get_month"|"calculator_open"|"instagram_open"|"facebook_open"|"linkedin_open"|"weather-show",
    "userInput":"<original user input>" {only remove your name from userInput if exists}
    and agar kisi ne google ya youtube pe kuch search karne ko bola hai to userInput me only bo search baala text jaye,
    "response":"<a short spoken response to read out loud to the user>"
    }
    Instructions:
        -> "type": determine the intent of the user.

        -> "userinput": original sentence the user spoke.

        ->"response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found", "Today is Tuesday", etc.
"general": if it's a factual or informational question.aur agar koi aisa question puchta jiska answer tumhe pata hai usko bhi general ki category me rakho bas short answer dena


"google_search": if user wants to search something on Google.

"youtube_search": if user wants to search something on YouTube.

"youtube_play": if user wants to directly play a video or song.

"calculator_open": if user wants to open a calculator.

"instagram_open": if user wants to open Instagram.

"facebook_open": if user wants to open Facebook.

"linkedin_open": if user wants to open LinkedIn.

"get_time": if user wants to know the current time.

"get_date": if user wants to know the current date.

"get_day": if user wants to know the current day.

"get_month": if user wants to know the current month.

"get_year": if user wants to know the current year.

"weather-show": if user wants to know the weather.

Important:

        -> Use ${userName} agar koi puche tumhe kisne banaya

        -> Only respond with the JSON object, nothing else.


now your userInput - ${command}


    `;

    const result = await axios.post(apiUrl, {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });
    return result.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.log(error);
  }
};

export default geminiResponse;
