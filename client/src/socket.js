import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "https://co-script-server.vercel.app";

  return io(backendUrl, options);
};
