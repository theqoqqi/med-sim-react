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
        this.#diseaseFactory = new DiseaseFactory(diseaseDescriptors, this.#parameterFactory);
        this.#medicationFactory = new MedicationFactory(medicationDescriptors, this.#parameterFactory);
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
            let human = this.#createHuman();

            this.addHuman(human);
        }
    }

    #createHuman() {
        let id = this.#getNextHumanId();

        return new Human({
            id,
            name: new Name(`Фамилия${id}`, `Имя${id}`, `Отчество${id}`),
            parameters: this.#parameterFactory.createParameters(),
        });
    }

    #getNextHumanId() {
        if (this.#world.allHumans.length === 0) {
            return 1;
        }

        let allIds = this.#world.allHumans.map(human => human.id);

        return Math.max(...allIds) + 1;
    }

    addHuman(human) {
        this.#world.addHuman(human);

        human.setSimulation(this);
    }

    update() {
        this.#currentDay++;
        this.#addRandomDiseases();
        this.#world.update();
        this.#addNewPatients();
    }

    #addRandomDiseases() {
        this.#world.aliveHumans.forEach(human => {
            let diseases = this.#diseaseFactory.createRandomSet();

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

    createMedication(descriptor) {
        return this.#medicationFactory.create(descriptor);
    }

    createDisease(descriptor) {
        return this.#diseaseFactory.create(descriptor);
    }

    getMedicationDescriptor(name) {
        return this.#medicationFactory.allDescriptorsByNames[name];
    }

    getDiseaseDescriptor(name) {
        return this.#diseaseFactory.allDescriptorsByNames[name];
    }

    mapParameterEffects(effects, callback, startPath = null) {
        return this.#parameterFactory.mapEffects(effects, callback, startPath);
    }

    getParameterTitle(parameterPath) {
        return this.#parameterFactory.getParameterDescriptor(parameterPath).title;
    }
}
