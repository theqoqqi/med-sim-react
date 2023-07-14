import Human from './humans/Human.js';

export default class World {

    #allHumans = [];

    constructor({ humans = [] } = {}) {
        this.addHumans(humans);
    }

    update() {
        for (const human of this.aliveHumans) {
            human.update();
        }
    }

    addHumans(humans) {
        for (const human of humans) {
            this.addHuman(human);
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
        return this.#allHumans.filter(human => !human.isAlive);
    }

    getHumanById(id) {
        return this.#allHumans.find(h => h.id === id);
    }

    toJson() {
        return {
            humans: this.#allHumans.map(h => h.toJson()),
        };
    }

    static fromJson(json) {
        return new World({
            humans: json.humans.map(h => Human.fromJson(h)),
        });
    }
}
