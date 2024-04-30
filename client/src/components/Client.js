import React from "react";
import Avatar from "react-avatar";

const Client = ({ username }) => {
  return (
    <div className="flex items-center flex-col font-bold">
      <Avatar name={username} size={50} round="14px" />
      <span className="mt-1">{username}</span>
    </div>
  );
};

export default Client;
