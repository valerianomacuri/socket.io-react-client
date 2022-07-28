import { ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import React, { createContext, ReactNode } from "react";
import { useSocketIO } from "./hooks";

type SocketIOContextType = {
  connected: boolean | undefined;
  disconnected: boolean;
  socketIO: Socket | undefined;
};

export const SocketIOContext = createContext({} as SocketIOContextType);

type SocketIOProps = {
  children: ReactNode;
  uri: string;
  opts?: Partial<ManagerOptions & SocketOptions>;
};

export const SocketIO = ({ children, uri, opts }: SocketIOProps) => {
  const socket = useSocketIO(uri, opts);
  return (
    <SocketIOContext.Provider
      value={{
        ...socket,
      }}
    >
      {children}
    </SocketIOContext.Provider>
  );
};
