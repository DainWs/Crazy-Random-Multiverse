import Party from "@/domain/models/Party";
import PartyCode from "@/domain/models/PartyCode";

const createPartyCode = (codeValue?: string): PartyCode => {
  return codeValue ?? `party-${Math.floor(Math.random() * 10000)}`;
}

const createParty = (code?: PartyCode, name?: string, 
  userCount?: number, maxUsers?: number,
  owner?: string, users?: string[]
): Party => {
  if (!code) code = createPartyCode();
  if (!name) name = `partyname-${Math.floor(Math.random() * 10000)}`;
  if (!userCount) userCount = Math.floor(Math.random() * 20) + 1;
  if (!maxUsers) maxUsers = 20;
  if (!owner) owner =`username-${Math.floor(Math.random() * 10000)}`
  if (!users) users = generateUsers(userCount, maxUsers);
  const party = new Party(code);
  party.name = name;
  party.userCount = userCount;
  party.maxUsers = maxUsers;
  party.owner = owner;
  party.users = users;
  return party;
}

function generateUsers(userCount: number, maxUsers: number): string[] {
  const users = new Array(maxUsers);

  for (let i = 0; i < userCount; i++) {
    users.push(`username-${Math.floor(Math.random() * 10000)}`);
  }
  return users;
}

export default {
  createPartyCode,
  createParty
};