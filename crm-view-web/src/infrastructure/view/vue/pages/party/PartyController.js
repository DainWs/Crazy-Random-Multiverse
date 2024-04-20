import { ref } from "vue"
import router from "@/infrastructure/view/vue/configuration/router";
import { getUser } from "@/application/userService";
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
    return getUser();
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