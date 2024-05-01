type Person = string;

type CreditSection = {
  id: string;
  name: string;
  people: Array<Person>;
};

type Credits = Array<CreditSection>;

interface CreditsRepository {
  findAllCredits(): Credits;
}

export { Person, CreditSection, Credits };
export default CreditsRepository;
