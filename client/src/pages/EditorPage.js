import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import CoScriptImage from "../assets/logo.png";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className=" flex ">
      <div className="bg-slate-900 p-[16px] text-white flex flex-col w-[250px] ">
        <div className="flex-1">
          <div className="flex gap-2 justify-center items-center mb-8">
            <img
              className="h-10 w-10 rounded-lg mt-1 p-0  "
              src={CoScriptImage}
              alt="CoScript Logo"
            />
            <h1 className="text-center text-4xl font-bold text-blue-700 m-0 p-0">
              CoScript
            </h1>
          </div>

          <h3 className="mt-2 mb-4 font-semibold text-green-500">Connected</h3>
          <div className="flex items-center flex-wrap gap-5">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <div className="flex gap-2 flex-row">
          <button
            className=" p-[10px] rounded-md font-bold cursor-pointer transition-all bg-blue-600 w-[150px] m-auto hover:bg-blue-800"
            onClick={copyRoomId}
          >
            Copy ROOM ID
          </button>
          <button
            className=" p-[10px] rounded-md font-bold cursor-pointer transition-all bg-red-600 w-[80px] m-auto hover:bg-red-800"
            onClick={leaveRoom}
          >
            Leave
          </button>
        </div>
      </div>
      <div className="editorWrap flex-1">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
