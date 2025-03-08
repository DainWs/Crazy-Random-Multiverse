import { Client } from '@stomp/stompjs';
import { SERVER_HOST } from '@/env';
import WebsocketHandler, { HandlerOptions } from '@/services/websocket/WebsocketHandler';

const WS_SERVER_HOST = new URL(SERVER_HOST);

type ClientOptions = {
  handler: HandlerOptions;
}

class WebsocketClient extends Client {
  private handler: WebsocketHandler;

  public constructor(options: ClientOptions) {
    super({
      brokerURL: `ws://${WS_SERVER_HOST.host}/ws`,
      reconnectDelay: 100,
      debug: (message) => console.log(message)
    });

    this.handler = new WebsocketHandler(options.handler);
    this.onConnect = (frame) => this.handler.onConnect(this, frame);
    this.onDisconnect = (frame) => this.handler.onDisconnect(this, frame);
    this.onStompError = (frame) => this.handler.onStompError(frame);
  }

  public connect(username: string) {
    this.connectHeaders['username'] = username;
    this.activate();
  }

  public disconnect() {
    this.deactivate();
  }

  public send(destination: string, message?: object) {
    try {
      let body: string | undefined;
      if (message !== undefined) {
        body = JSON.stringify(message);
      }

      this.publish({ destination, body });
    } catch (error) {
      console.log(error);
      if (!(error instanceof Error)) throw error;
      if (!error.message.includes("There is no underlying STOMP connection")) throw error;
    }
  }
}

export { ClientOptions };
export default WebsocketClient;