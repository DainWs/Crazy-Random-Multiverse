import router from "@/view/vue/configuration/router";
import { createParty } from "@/application/partyService";

const onCreatePartyClick = async () => {
    await createParty();
    router.push('/party');
}

const onJoinPartyClick = () => {
    router.push('/party-list');
}

const onSettingsClick =  () => {
    router.push('/settings');
}

const onCreditsClick = () => {
    router.push('/credits')
}

const onExitClick = () => {
    if (isNotBrowserPlatform()) {
        // TODO interface to close app not defined
        system?.exit();
    }
}

const isNotBrowserPlatform = () => {
    return CRM_PLATAFORM !== 'browser';
}

export default {
    isNotBrowserPlatform,
    onCreatePartyClick,
    onJoinPartyClick,
    onSettingsClick,
    onCreditsClick,
    onExitClick
}