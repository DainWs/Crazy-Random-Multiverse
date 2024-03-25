import creditsRepository from "@/repositories/creditsRepository"

const getCredits = () => {
    return creditsRepository.findAllCredits();
}

export {
    getCredits
}