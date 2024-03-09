import { ref } from "vue";

const sections = ref([
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
])

const getCredits = () => {
    return sections;
}

export default { getCredits };