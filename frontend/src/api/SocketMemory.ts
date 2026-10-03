
type SocketMemory = {
  activeGameCode: string | null;
  activePlayerCode: string | null;
  clearMemory: () => void;
}

const socketMemory: SocketMemory = {
  activeGameCode: null,
  activePlayerCode: null,

  clearMemory: () => {
    socketMemory.activeGameCode = null;
    socketMemory.activePlayerCode = null;
  }
}
export default socketMemory