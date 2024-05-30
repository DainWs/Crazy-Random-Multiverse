import { Credits } from '@/domain/CreditsRepository';

const CREDITS: Credits = [
  {
    id: 'section__director',
    name: 'Directors',
    people: ['DainWs']
  },
  {
    id: 'section__developer',
    name: 'Developers',
    people: ['DainWs']
  },
  {
    id: 'section__designer',
    name: 'Designers',
    people: ['DainWs']
  }
];

const findAllCredits = (): Credits => {
  return CREDITS;
};

export default {
  findAllCredits
};
