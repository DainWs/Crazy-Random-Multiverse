import router from '@vue-root/configuration/router';
import {getCredits} from '@/application/creditsService';

const getAllCredits = () => {
  return getCredits();
};

const onBackClick = () => {
  router.push('/');
};

export default {
  getCredits: getAllCredits,
  onBackClick
};
