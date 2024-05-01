import { Credits } from '@/domain/CreditsRepository';
import { creditsRepository } from '@/infrastructure/repositories';

const getCredits = (): Credits => {
  return creditsRepository.findAllCredits();
};

export { getCredits };
