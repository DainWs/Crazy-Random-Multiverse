export default class Hand {
    constructor() {
        this.cards = new Array()
    }

    addCard(card) {
        this.cards.push(card)
    }

    removeCard(index) {
        const deleteCount = 1;
        this.cards.splice(index, deleteCount)
    }

    removeAllMatch(predicate) {
        console.log("Before remove matches:")
        console.log(this.cards)
        const cardsToRemove = this.cards.filter(predicate)
        for (const card of cardsToRemove) {
            this.removeCard(this.cards.indexOf(card))
        }
        console.log("After remove matches:")
        console.log(this.cards)
    }

    getCard(index) {
        return this.cards.at(index)
    }

    getAllMatch(predicate) {
        return this.cards.filter(predicate)
    }

    getAllWithCardCode(cardCode) {
        return this.cards.filter(card => card.code == cardCode);
    }
}