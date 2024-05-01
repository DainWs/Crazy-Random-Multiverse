import PartyDto from '@/infrastructure/stomp/dto/PartyDto';

type PartyListDto = {
  parties: Array<PartyDto>;
};

export default PartyListDto;
