import Event from '@/domain/events/Event';
import PartyList from '@/domain/models/PartyList';

type PartyListEventCode = 'PARTY_LIST_UPDATE';

class PartyListEvent extends Event<PartyList> {
  public constructor(code: PartyListEventCode, details: PartyList) {
    super(code, details);
  }

  public getCode(): PartyListEventCode {
    return this.getCode();
  }
}

export {PartyListEventCode};
export default PartyListEvent;
