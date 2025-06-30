import React, { useContext } from "react";
import { userDataContext } from "./context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const { userData, serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/sigin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px]">
      <button
        className="min-w-[150px] h-[40px] bg-white absolute  top-[100px] right-[20px] rounded-full cursor-pointer text-black font-semibold text-20px px-[20px] py-[10px]"
        onClick={() => navigate("/customize")}
      >
        Customize Your Assistant
      </button>

      <button
        className="min-w-[150px] h-[40px] bg-white rounded-full cursor-pointer text-black font-semibold absolute top-[20px] right-[20px] text-20px mt-[30px]"
        onClick={handleLogOut}
      >
        Log Out
      </button>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        <img
          src={userData?.assistantImage}
          alt=""
          className="h-full object-cover"
        ></img>
      </div>

      <h1 className="text-white text-[18px] font-semibold">
        I'm {userData?.assistantName}
      </h1>
    </div>
  );
}

export default Home;
