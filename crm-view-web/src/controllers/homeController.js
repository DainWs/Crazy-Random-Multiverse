import { createParty } from '@/api/v1.js'

const createPartyProxy = async () => {
    await createParty();
}

export default {
    createParty: createPartyProxy
}