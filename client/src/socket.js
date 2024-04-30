import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
  const backendUrl =
    "https://co-script-server-git-main-hammads-projects-1d8bde63.vercel.app";

  return io(backendUrl, options);
};
