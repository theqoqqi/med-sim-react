import ParameterFactory from './parameters/ParameterFactory';
import DiseaseFactory from './effectors/DiseaseFactory';
import World from './World';
import Name from './humans/Name';
import Human from './humans/Human';

export default class Simulation {

    #parameterFactory;

    #diseaseFactory;

    #world;

    constructor({parameterDescriptors, diseaseDescriptors}) {
        this.#parameterFactory = new ParameterFactory(parameterDescriptors);
        this.#diseaseFactory = new DiseaseFactory(diseaseDescriptors);
        this.#world = new World();
    }

    get allHumans() {
        return this.#world.allHumans;
    }

    update() {
        this.#world.update();
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
        let human = new Human(name, parameters);
        let diseases = this.#diseaseFactory.createRandomSet(human);

        human.addDiseases(diseases);

        return human;
    }
}
