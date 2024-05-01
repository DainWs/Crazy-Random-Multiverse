import {Client as StompClient} from '@stomp/stompjs';
import messageController from '@/infrastructure/stomp/messageController';

import IApiClient from '@api/IClient';
import Destination from '@api/Destination';
import Message from '@api/Message';

class StompClientImpl extends StompClient implements IApiClient {
  public constructor(username: string, serverHost: string) {
    super({
      brokerURL: `ws://${serverHost}/ws`,
      connectHeaders: {username},
      reconnectDelay: 100,
      debug: (message) => console.log(message)
    });

    this.onConnect = (frame) => messageController.onConnect(this, frame);
    this.onDisconnect = (frame) => messageController.onDisconnect(this, frame);
    this.onStompError = (frame) => messageController.onStompError(frame);
    this.activate();
  }

  public async send(
    destination: Destination,
    message?: Message
  ): Promise<void> {
    let body: string | undefined;
    if (message !== undefined) {
      body = JSON.stringify(message);
    }

    return await this.publish({destination, body});
  }
}

export default StompClientImpl;
