import PartyCode from '@/domain/models/PartyCode';

type Username = string;

type PartyDto = {
  code: PartyCode;
  name: string;
  userCount: number;
  maxUsers: number;
  owner: Username;
  users: Array<Username>;
};

export default PartyDto;
