import Party from '@/domain/models/Party';

type PartyEventCode = 'PARTY_INFO_UPDATE';

class PartyEvent {
  public code: PartyEventCode;
  public details: Party;

  public constructor(code: PartyEventCode, details: Party) {
    this.code = code;
    this.details = details;
  }
}

export default PartyEvent;
