import { useEffect, useState } from "react";
import socket from "../socket/socket";

const useOnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.emit("get_online_users");

    socket.on("online_users", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online_users");
    };
  }, []);

  useEffect(() => {
    console.log("online_users:", onlineUsers);
  }, [onlineUsers]);

  const isOnline = (friendId: number) => {
    return onlineUsers.includes(String(friendId));
  };

  return { onlineUsers, isOnline };
};

export default useOnlineUsers;
