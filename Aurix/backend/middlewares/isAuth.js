import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    //req has cookies which come from the frontend we need token cookie inside the object so we get the token

    console.log("[isAuth] Cookies received:", req.cookies); // see what's in cookies

    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({
        message: "token not found",
      });
    }

    //this wl have an object with user's id etc etc
    const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);

    req.userId = verifyToken.userId; //users current id present already

    next();
  } catch (error) {
    console.error("isAuth error:", error);
    return res.status(500).json({
      message: "is Auth error",
      error: error.message,
    });
  }
};
export default isAuth;
