import router from '@view/configuration/router';
import JSON from '@resources/Credits.json';

const getAllCredits = () => {
  return JSON.credits;
};

const onBackClick = () => {
  router.push('/');
};

export default {
  getCredits: getAllCredits,
  onBackClick
};
