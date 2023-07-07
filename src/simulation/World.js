
export default class World {

    #allHumans = [];

    update() {
        for (const human of this.aliveHumans) {
            human.update();
        }
    }

    addHuman(human) {
        this.#allHumans.push(human);
    }

    removeHuman(human) {
        const index = this.#allHumans.indexOf(human);

        if (index !== -1) {
            this.#allHumans.splice(index, 1);
        }
    }

    get allHumans() {
        return [...this.#allHumans];
    }

    get aliveHumans() {
        return this.#allHumans.filter(human => human.isAlive);
    }

    get deadHumans() {
        return this.#allHumans.filter(human => human.isDead);
    }
}
