import { Client, IMessage, StompConfig } from '@stomp/stompjs';
import Card, { CardCode, CardRarity, CardType } from "@/domain/Card";
import { Damage, Armor, Health } from "@/domain/Statistics";
import StoreSystem from '@/core/StoreSystem';

class WebSocketService {
  private client: Client;

  constructor() {
    const wsUrl = '/ws';
    
    const config: StompConfig = {
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        this.subscribeToEvents();
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    };

    this.client = new Client(config);
  }

  public connect(): void {
    if (!this.client.active) {
      this.client.activate();
    }
  }

  public disconnect(): void {
    if (this.client.active) {
      this.client.deactivate();
    }
  }

  private subscribeToEvents(): void {
    this.client.subscribe('/user/topic/event', (message: IMessage) => {
      this.handleEvent(JSON.parse(message.body));
    });

    this.client.subscribe('/user/topic/error', (message: IMessage) => {
      this.handleError(JSON.parse(message.body));
    });
  }

  private handleEvent(event: any): void {
    console.log('Received event:', event);
    
    // Example mapping based on EventCode.java
    switch (event.code) {
      case 'GAME_START':
        if (event.details) {
          this.updateGameState(event.details);
        }
        break;
      case 'PLAYER_RECEIVE_CARD':
        // Update hand if needed or wait for full state update
        break;
    }
  }

  private updateGameState(details: any): void {
    if (details.playerHand) {
      const hand = details.playerHand.map((cardDto: any) => fromDto(cardDto));
      StoreSystem.setPlayerHand(hand);
    }
    // TODO: Map zones similarly when they use card DTOs
  }

  private handleError(error: any): void {
    console.error('Received error event:', error);
  }

  public sendAction(destination: string, body: any): void {
    if (this.client.connected) {
      this.client.publish({
        destination: `/application${destination}`,
        body: JSON.stringify(body),
      });
    } else {
      console.error('Cannot send action: WebSocket not connected');
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;


interface CardDto {
  code: {
    number: number;
    type: CardType;
  };
  name: string;
  description: string;
  type: CardType;
  rarity?: CardRarity;
  damage?: { value: number; type: any };
  armor?: { value: number; type: any };
  health?: { value: number; maxValue: number };
  activeSkill?: any;
  passiveSkill?: any;
  equipment?: CardDto;
}

function fromDto(dto: CardDto): Card {
  const code = new CardCode(dto.code.number, dto.code.type);
  const card = new Card({
    code,
    name: dto.name,
    description: dto.description,
    type: dto.type,
    rarity: dto.rarity
  });

  if (dto.damage) {
    card.damage = Damage(dto.damage.type, dto.damage.value);
  }
  
  if (dto.armor) {
    card.armor = Armor(dto.armor.type, dto.armor.value);
  }
  if (dto.health) {
    card.health = Health(dto.health.value, dto.health.maxValue);
  }

    if (dto.activeSkill) {
    card.activeSkill = dto.activeSkill;
  }

    if (dto.passiveSkill) {
    card.passiveSkill = dto.passiveSkill;
  }

    if (dto.equipment) {
    card.equipment = fromDto(dto.equipment) as any;
  }

    return card;
}