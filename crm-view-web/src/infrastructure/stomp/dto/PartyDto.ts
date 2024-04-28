import PartyCode from "@/domain/models/PartyCode";

type Username = string;

type PartyDto = {    
    code: PartyCode,
    name: string,
    userCount: Number,
    maxUsers: Number,
    owner: Username,
    users: Array<Username>
}

export default PartyDto;