import Party from "@/domain/models/Party";

class PartyList {
    public parties: Array<Party>;

    public constructor() {
        this.parties = new Array();
    }

    public add(party: Party) {
        if (!this.parties.includes(party)) {
            this.parties.push(party);
        }
    }
}

export default PartyList;