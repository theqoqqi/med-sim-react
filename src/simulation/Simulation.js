import ParameterFactory from './parameters/ParameterFactory';
import World from './World';
import Name from './humans/Name';
import Human from './humans/Human';
import DiseaseFactory from './effectors/diseases/DiseaseFactory.js';
import MedicationFactory from './effectors/medications/MedicationFactory.js';

export default class Simulation {

    #parameterFactory;

    #diseaseFactory;

    #medicationFactory;

    #world;

    #currentPatients = [];

    #currentDay = 0;

    constructor({parameterDescriptors, diseaseDescriptors, medicationDescriptors}) {
        this.#parameterFactory = new ParameterFactory(parameterDescriptors);
        this.#diseaseFactory = new DiseaseFactory(diseaseDescriptors);
        this.#medicationFactory = new MedicationFactory(medicationDescriptors);
        this.#world = new World();
    }

    get allHumans() {
        return this.#world.allHumans;
    }

    get aliveHumans() {
        return this.#world.aliveHumans;
    }

    get deadHumans() {
        return this.#world.deadHumans;
    }

    get allPatients() {
        return this.#currentPatients;
    }

    get currentDay() {
        return this.#currentDay;
    }

    get allMedicationDescriptors() {
        return this.#medicationFactory.allDescriptors;
    }

    get allDiseaseDescriptors() {
        return this.#diseaseFactory.allDescriptors;
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

        return new Human(this, name, parameters);
    }

    update() {
        this.#currentDay++;
        this.#addRandomDiseases();
        this.#world.update();
        this.#addNewPatients();
    }

    #addRandomDiseases() {
        this.#world.aliveHumans.forEach(human => {
            let diseases = this.#diseaseFactory.createRandomSet(human);

            human.addEffectors(diseases);
        });
    }

    #addNewPatients() {
        this.#currentPatients = [];

        for (const human of this.aliveHumans) {
            const discomfortLevel = human.getDiscomfortLevel();
            const decision = Math.random();

            if (decision <= discomfortLevel) {
                this.#currentPatients.push(human);
            }
        }
    }

    removePatient(human) {
        let index = this.#currentPatients.indexOf(human);

        if (index !== -1) {
            this.#currentPatients.splice(index, 1);
        }
    }

    createMedication(human, descriptor) {
        return this.#medicationFactory.createFromDescriptor(human, descriptor);
    }

    createDisease(human, descriptor) {
        return this.#diseaseFactory.createFromDescriptor(human, descriptor);
    }

    mapParameterEffects(effects, callback, startPath = null) {
        return this.#parameterFactory.mapEffects(effects, callback, startPath);
    }

    getParameterTitle(parameterPath) {
        return this.#parameterFactory.getParameterDescriptor(parameterPath).title;
    }
}
