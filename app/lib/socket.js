let io = null;

export function setSocketIO(socketInstance) {
  io = socketInstance;
}

export function getSocketIO() {
  return io;
}
