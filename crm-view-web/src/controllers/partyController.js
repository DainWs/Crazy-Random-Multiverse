import { navigate } from '@/view';
import { joinParty, refreshPartyList } from '@/api/v1.js';

const parties = []
setTimeout(() => {
    console.log("cambio")
    parties.push({
        code: "undefined",
        name: "undefined",
        userCount: 0,
        maxUsers: 4,
        owner: "undefined",
        users: []
    })
}, 5000)

const partiesProxy = new Proxy(parties, {
    get: (target, property) => target,
    set: (target, property, value) => target
})

const getParties = () => {
    return new Proxy(
        parties,

        );
}

const doJoinParty = async (party) => {
    await joinParty(party);
    navigate('/party');
}

const doRefreshParties = async () => {
    await refreshPartyList();
}

export default {
    getParties,
    joinParty: doJoinParty,
    refreshParties: doRefreshParties
}