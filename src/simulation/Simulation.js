import ParameterFactory from './parameters/ParameterFactory';
import DiseaseFactory from './effectors/DiseaseFactory';
import World from './World';
import Name from './humans/Name';
import Human from './humans/Human';

export default class Simulation {

    #parameterFactory;

    #diseaseFactory;

    #world;

    #currentPatients = [];

    #currentDay = 0;

    constructor({parameterDescriptors, diseaseDescriptors}) {
        this.#parameterFactory = new ParameterFactory(parameterDescriptors);
        this.#diseaseFactory = new DiseaseFactory(diseaseDescriptors);
        this.#world = new World();
    }

    get allHumans() {
        return this.#world.allHumans;
    }

    get aliveHumans() {
        return this.#world.aliveHumans;
    }

    get allPatients() {
        return this.#currentPatients;
    }

    get currentDay() {
        return this.#currentDay;
    }

    populate(amount) {
        for (let i = 0; i < amount; i++) {
            let human = this.createHuman();

            this.#world.addHuman(human);
        }
    }

    createHuman() {
        let parameters = this.#parameterFactory.createParameters();
        let ordinal = this.#world.allHumans.length + 1;
        let name = new Name(`Фамилия${ordinal}`, `Имя${ordinal}`, `Отчество${ordinal}`);

        return new Human(name, parameters);
    }

    update() {
        this.#currentDay++;
        this.addRandomDiseases();
        this.#world.update();
        this.collectPatients();
    }

    addRandomDiseases() {
        this.#world.aliveHumans.forEach(human => {
            let diseases = this.#diseaseFactory.createRandomSet(human);

            human.addDiseases(diseases);
        });
    }

    collectPatients() {
        this.#currentPatients = [];

        for (const human of this.aliveHumans) {
            const discomfortLevel = human.getDiscomfortLevel();
            const decision = Math.random();

            if (decision <= discomfortLevel) {
                this.#currentPatients.push(human);
            }
        }
    }
}
