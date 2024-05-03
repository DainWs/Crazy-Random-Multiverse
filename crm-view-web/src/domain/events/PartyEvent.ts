import Event from '@/domain/events/Event';
import Party from '@/domain/models/Party';

type PartyEventCode = 'PARTY_INFO_UPDATE';

class PartyEvent extends Event<Party> {
  public constructor(code: PartyEventCode, details: Party) {
    super(code, details);
  }

  public getCode(): PartyEventCode {
    return this.getCode();
  }
}

export {PartyEventCode};
export default PartyEvent;
