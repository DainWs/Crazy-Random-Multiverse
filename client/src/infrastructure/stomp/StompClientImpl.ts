import { Client as StompClient } from '@stomp/stompjs';
import messageController from '@/infrastructure/stomp/messageController';

import IApiClient, { Destination, Message } from '@api/IClient';

class StompClientImpl extends StompClient implements IApiClient {
  public constructor(username: string, serverHost: string) {
    super({
      brokerURL: `ws://${serverHost}/ws`,
      connectHeaders: { username },
      reconnectDelay: 100,
      debug: (message) => console.log(message)
    });

    this.onConnect = (frame) => messageController.onConnect(this, frame);
    this.onDisconnect = (frame) => messageController.onDisconnect(this, frame);
    this.onStompError = (frame) => messageController.onStompError(frame);
    this.activate();
  }

  public async send(destination: Destination, message?: Message): Promise<void> {
    try {
      let body: string | undefined;
      if (message !== undefined) {
        body = JSON.stringify(message);
      }

      return this.publish({ destination, body });
    } catch (error) {
      console.log(error);
      if (!(error instanceof Error)) throw error;
      if (!error.message.includes("There is no underlying STOMP connection")) throw error;
    }
  }
}

export default StompClientImpl;
