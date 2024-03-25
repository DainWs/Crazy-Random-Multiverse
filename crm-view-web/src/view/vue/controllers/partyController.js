import { ref } from "vue"
import router from "@/view/vue/configuration/router";
import { getSetting } from "@/application/settingsService";
import { startParty, leaveParty, refreshPartyInfo, setPartyInfoUpdateHandler } from "@/application/partyService";

const defaultPartyInfo = {
    code: undefined,
    name: undefined,
    isSpectator: false,
    isAlive: true,
    users: []
};

const partyInfo = ref(defaultPartyInfo);
setPartyInfoUpdateHandler(newPartyInfo => partyInfo.value = newPartyInfo);

const getUserInfo = () => {
    return { 
        username: getSetting('username')
    }
}

const getReactivePartyInfo = () => {
    return partyInfo;
}

const onLoad = async () => {
    await refreshPartyInfo();
}

const onStartClick = async () => {
    await startParty();
}

const onLeaveClick = async () => { 
    await leaveParty();
    partyInfo.value = defaultPartyInfo;
    router.push('/');
}

export default {
    getUserInfo,
    getReactivePartyInfo,
    onLoad,
    onStartClick,
    onLeaveClick
}