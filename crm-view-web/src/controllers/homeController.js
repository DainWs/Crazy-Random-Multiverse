import StompDestinations from '@/services/stomp/StompDestinations';
import stompService from '@/services/stomp/StompService';

const createParty = async () => {
    await stompService.send(StompDestinations.PARTY_CREATE);
}

const refreshParties = async () => {
    await stompService.sendSync(StompDestinations.PARTY_LIST);
}

export default {
    createParty,
    refreshParties
}