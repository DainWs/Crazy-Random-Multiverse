import WebsocketClient, { ClientOptions } from "@/services/websocket/WebsocketClient"
import useSessionStore from "@/stores/SessionStore";
import usePartyStore from "@/stores/PartyStore";

let clientInstance: WebsocketClient;

const useWebsocket = () => {
  const sessionStore = useSessionStore();
  const partyStore = usePartyStore();

  const options: ClientOptions = {
    handler: {
      onParty: party => partyStore.currentParty = party,
      onPartyList: parties => partyStore.allParties = parties,
      onGameEvent: () => { console.log("not configured") },
      onGameError: () => { console.log("not configured") }
    }
  }

  clientInstance = new WebsocketClient(options);

  partyStore.$subscribe((_, state) => {
    if (state.currentParty) onJoinParty();
    if (!state.currentParty) onLeaveParty();
  });

  function onJoinParty() {
    clientInstance.connect(sessionStore.currentUser.username);
  }

  function onLeaveParty() {
    clientInstance.disconnect();
  }
}

const useWebsocketAPI = () => {
  const send = (destination: string, message?: object) => {
    if (clientInstance) clientInstance.send(destination, message);
  }

  return { send };
}

export { useWebsocket }
export default useWebsocketAPI;