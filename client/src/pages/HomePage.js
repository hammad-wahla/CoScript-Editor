import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CoScriptImage from "../assets/logo.png";

const Home = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Room Created");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Room Id & Username is required");
      return;
    }

    // Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };
  return (
    <div className=" flex items-center justify-center bg-gray-900 h-screen text-white ">
      <div className=" bg-gray-800 p-5 rounded-xl w-[400px] max-w-[90%]">
        <div className="flex gap-2 justify-center items-center mb-8">
          <img
            className="h-10 w-10 rounded-lg mt-1 p-0  "
            src={CoScriptImage}
            alt="CoScript Logo"
          />
          <h1 className="text-center text-4xl font-bold text-blue-700">
            CoScript
          </h1>
        </div>
        <h4 className=" mt-0 mb-5">Paste Room Id</h4>
        <div className="flex flex-col">
          <input
            type="text"
            className="p-[10px] rounded-md outline-none border-transparent mb-4 bg-slate-50 font-bold text-black "
            placeholder="ROOM ID"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="p-[10px] rounded-md outline-none border-transparent mb-4 bg-slate-50 font-bold text-black  "
            placeholder="USERNAME"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            onKeyUp={handleInputEnter}
          />
          <button
            className=" p-[10px] rounded-md font-bold cursor-pointer transition-all bg-blue-600 w-[100px] ml-auto hover:bg-blue-800 "
            onClick={joinRoom}
          >
            Join
          </button>
          <span className=" m-auto mt-[20px]">
            Don't have a Room Id ? Create new &nbsp;
            <a
              onClick={createNewRoom}
              href=""
              className=" text-blue-500 font-bold decoration-0 border-b-blue-800 transition-all"
            >
              Room Id
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
