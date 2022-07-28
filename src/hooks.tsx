import { useContext, useEffect, useState } from "react";
import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import { SocketIOContext } from "./context";

export const useSocketIOContext = () => useContext(SocketIOContext);

export const useEmit = (ev: string, ...args: any[]) => {
  const { socketIO } = useSocketIOContext();
  useEffect(() => {
    socketIO?.emit(ev, ...args);
  }, [socketIO, ...args]);
};

export const useOn = (ev: string, listener: (...args: any[]) => void) => {
  const { socketIO } = useSocketIOContext();
  useEffect(() => {
    socketIO?.on(ev, listener);
    return () => {
      socketIO?.off(ev, listener);
    };
  }, [socketIO, listener]);
};

export const useSocketIO = (
  uri: string,
  opts?: Partial<ManagerOptions & SocketOptions>
) => {
  const [socketIO, setSocketIO] = useState<Socket | undefined>(undefined);
  const [connected, setConnected] = useState<boolean | undefined>(false);

  useEffect(() => {
    const socket = io(uri, opts);
    setSocketIO(socket);
  }, [uri, opts]);

  useEffect(() => {
    setConnected(socketIO?.connected);
  }, [socketIO]);

  useEffect(() => {
    socketIO?.on("connect", () => {
      setConnected(true);
    });
    return () => {
      socketIO?.off("connect");
    };
  }, [socketIO]);

  useEffect(() => {
    socketIO?.on("disconnect", () => {
      setConnected(false);
    });
    return () => {
      socketIO?.off("disconnect");
    };
  }, [socketIO]);

  return {
    connected,
    disconnected: !connected,
    socketIO,
  };
};
