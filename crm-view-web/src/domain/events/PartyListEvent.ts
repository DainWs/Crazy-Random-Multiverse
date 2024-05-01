import PartyList from '@/domain/models/PartyList';

type PartyListEventCode = 'PARTY_LIST_UPDATE';

class PartyListEvent {
  public code: PartyListEventCode;
  public details: PartyList;

  public constructor(code: PartyListEventCode, details: PartyList) {
    this.code = code;
    this.details = details;
  }
}

export default PartyListEvent;
