import router from "@/infrastructure/view/vue/configuration/router";
import { getCredits } from "@/application/creditsService";

const getAllCredits = () => {
    return getCredits();
}

const onBackClick = () => {
    router.push('/');
}

export default { 
    getCredits: getAllCredits,
    onBackClick
};