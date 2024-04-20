import creditsRepository from "@/infrastructure/repositories/creditsRepository"

const getCredits = () => {
    return creditsRepository.findAllCredits();
}

export {
    getCredits
}