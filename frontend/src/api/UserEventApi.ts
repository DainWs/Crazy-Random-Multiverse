import type { Listener } from "@/api/models/Listeners";
import type Party from "@/domain/Party";
import socketEventHandler from "@/api/SocketEventHandler";

const onPartyInfo = (listener: Listener<Party>) => {
  return socketEventHandler.onPartyInfo(listener);
}

const onUserSynced = (listener: Listener<void>) => {
  return socketEventHandler.onUserSynced(listener);
}

export {
  onPartyInfo,
  onUserSynced
}
