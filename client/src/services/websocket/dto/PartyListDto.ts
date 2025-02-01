import PartyDto from '@/services/websocket/dto/PartyDto';

type PartyListDto = {
  parties: Array<PartyDto>;
};

export default PartyListDto;
