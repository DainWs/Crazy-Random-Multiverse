import {creditsRepository} from '@/infrastructure/repositories';

const getCredits = () => {
  return creditsRepository.findAllCredits();
};

export {getCredits};
