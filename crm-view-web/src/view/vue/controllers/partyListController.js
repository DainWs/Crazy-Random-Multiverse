import { ref } from 'vue';
import router from "@/view/vue/configuration/router";
import { joinParty, refreshPartyList, setPartyListUpdateHandler } from '@/application/partyService';

const partyList = ref({parties: []});
setPartyListUpdateHandler(newPartyList => partyList.value = newPartyList);

const getReactivePartyList = () => {
    return partyList;
}

const onLoad = async () => {
    await refreshPartyList();
}

const onRefreshPartiesClick = async () => {
    await refreshPartyList();
}

const onJoinPartyClick = async (party) => {
    await joinParty(party.code);
    router.push('/party');
}

const onBackClick = () => {
    router.push('/');
}

export default {
    getReactivePartyList,
    onLoad,
    onRefreshPartiesClick,
    onJoinPartyClick,
    onBackClick
}