import { Credits } from '@/domain/CreditsRepository';

const CREDITS: Credits = [
  {
    id: 'section__director',
    name: 'Director',
    people: ['DainWs']
  },
  {
    id: 'section__developer',
    name: 'Developer',
    people: ['DainWs']
  },
  {
    id: 'section__designer',
    name: 'Designer',
    people: ['DainWs']
  }
];

const findAllCredits = (): Credits => {
  return CREDITS;
};

export default {
  findAllCredits
};
