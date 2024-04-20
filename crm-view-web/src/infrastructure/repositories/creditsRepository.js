/**
 * @typedef Person
 * @type {string}
 */

/**
 * @typedef CreditSection
 * @property {string} id
 * @property {string} name
 * @property {Array.<Person>} people
 */

/**
 * @typedef Credits
 * @type {Array.<CreditSection>}
 */

/**
 * @type {Credits}
 */
const CREDITS = [
    {
        id: "section__director",
        name: "Director",
        people: [
            "DainWs"
        ]
    },
    {
        id: "section__developer",
        name: "Developer",
        people: [
            "DainWs"
        ] 
    },
    {
        id: "section__designer",
        name: "Designer",
        people: [
            "DainWs"
        ] 
    }
]

const findAllCredits = () => {
    return CREDITS;
}

export default {
    findAllCredits
}