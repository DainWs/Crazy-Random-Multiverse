import { Client, IFrame, IMessage } from '@stomp/stompjs';
import mapper from '@/services/websocket/mapper';
import ErrorDto from '@/services/websocket/dto/ErrorDto';
import PartyDto from '@/services/websocket/dto/PartyDto';
import PartyListDto from '@/services/websocket/dto/PartyListDto';
import GameEventDto from '@/services/websocket/dto/GameEventDto';
import Party from '@/domain/models/Party';
import GameEvent from '@/domain/events/GameEvent';
import GameError from '@/domain/models/GameError';

type PartyCallback = (party: Party) => void;
type PartyListCallback = (parties: Party[]) => void;
type GameEventCallback = (event: GameEvent) => void;
type GameErrorCallback = (error: GameError) => void;

type HandlerOptions = {
  onParty: PartyCallback;
  onPartyList: PartyListCallback;
  onGameEvent: GameEventCallback;
  onGameError: GameErrorCallback;
}

class WebsocketHandler {
  private partyCallback: PartyCallback;
  private partyListCallback: PartyListCallback;
  private gameEventCallback: GameEventCallback;
  private gameErrorCallback: GameErrorCallback;

  public constructor(options: HandlerOptions) {
    this.partyCallback = options.onParty;
    this.partyListCallback = options.onPartyList;
    this.gameEventCallback = options.onGameEvent;
    this.gameErrorCallback = options.onGameError;
  }

  public onConnect(stompClient: Client, frame: IFrame) {
    stompClient.subscribe('/user/topic/party/info', this.onPartyInfoMessage);
    stompClient.subscribe('/user/topic/party/list', this.onPartyListMessage);
    stompClient.subscribe('/user/topic/error', this.onGameErrorMessage);
    stompClient.subscribe('/user/topic/event', this.onGameEventMessage);
    this.log('Connected');
  };

  public onDisconnect(stompClient: Client, frame: IFrame) {
    stompClient.unsubscribe('/user/topic/user/info');
    stompClient.unsubscribe('/user/topic/party/info');
    stompClient.unsubscribe('/user/topic/party/list');
    stompClient.unsubscribe('/user/topic/error');
    stompClient.unsubscribe('/user/topic/event');
    this.log('Disconnected');
  };

  public onStompError(frame: IFrame) {
    this.log('------------------------------------------------');
    this.log('WS: Broker reported error: ' + frame.headers['message']);
    this.log('WS: Additional details: ' + frame.body);
    this.log('------------------------------------------------');
  };

  private onPartyInfoMessage(message: IMessage) {
    const partyDto: PartyDto = JSON.parse(message.body);
    const party = mapper.mapPartyDtoToParty(partyDto);
    this.partyCallback(party);
  }

  private onPartyListMessage(message: IMessage) {
    const partyListDto: PartyListDto = JSON.parse(message.body);
    const partyList = mapper.mapPartyListDtoToPartyList(partyListDto);
    this.partyListCallback(partyList);
  }

  private onGameEventMessage(message: IMessage) {
    console.log("PETOOOOO")
    const gameEventDto: GameEventDto = JSON.parse(message.body);
    this.gameEventCallback(mapper.mapGameEventDtoToGameEvent(gameEventDto));
  }

  private onGameErrorMessage(message: IMessage) {
    const errorDto: ErrorDto = JSON.parse(message.body);
    const gameError = mapper.mapErrorDtoToGameError(errorDto);
    this.gameErrorCallback(gameError);
  }

  private log(message: string) {
    console.log(message);
  }
}

export { HandlerOptions };
export default WebsocketHandler;