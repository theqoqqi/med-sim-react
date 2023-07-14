import ParameterFactory from './parameters/ParameterFactory';
import World from './World';
import Name from './humans/Name';
import Human from './humans/Human';
import DiseaseFactory from './effectors/diseases/DiseaseFactory.js';
import MedicationFactory from './effectors/medications/MedicationFactory.js';
import NumberRange from './utils/NumberRange.js';

export default class Simulation {

    #parameterFactory;

    #diseaseFactory;

    #medicationFactory;

    #id;

    #startedAt;

    #title;

    #world;

    #currentPatients = [];

    #currentDay = 0;

    constructor({parameterDescriptors, diseaseDescriptors, medicationDescriptors}) {
        this.#parameterFactory = new ParameterFactory(parameterDescriptors);
        this.#diseaseFactory = new DiseaseFactory(diseaseDescriptors, this.#parameterFactory);
        this.#medicationFactory = new MedicationFactory(medicationDescriptors, this.#parameterFactory);
        this.#id = Date.now();
        this.#startedAt = new Date();
        this.#title = 'Сохранение ' + new Date().toLocaleDateString();
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

    save() {
        return {
            simulationId: this.#id,
            startedAt: this.#startedAt.getTime(),
            title: this.#title,
            world: Simulation.#worldToJson(this.#world),
            currentPatients: this.#currentPatients.map(p => p.id),
            currentDay: this.#currentDay,
        };
    }

    static #worldToJson(world) {
        let json = world.toJson();

        json.humans.forEach(human => {
            human.parameters = this.#removeStaticData(human.parameters);
        });

        return json;
    }

    static #removeStaticData(parameter) {
        this.#removeKeys(parameter, [
            'title',
        ]);

        if (parameter.className === 'CompositeParameter') {
            Object.entries(parameter.value).forEach(([childName, child]) => {
                parameter.value[childName] = this.#removeStaticData(child);
            });
        }

        if (parameter.className === 'NumberParameter') {
            this.#removeKeys(parameter, [
                'validRange',
                'normalRange',
                'viableRange',
                'lethalRange',
                'randomType',
                'randomOptions',
            ]);
        }

        if (parameter.className === 'EnumParameter') {
            this.#removeKeys(parameter, [
                'allowedValues',
            ]);
        }

        return parameter;
    }

    static #removeKeys(object, keys) {
        for (let key of keys) {
            delete object[key];
        }
    }

    load(json) {
        this.#id = json.simulationId;
        this.#startedAt = new Date(json.startedAt);
        this.#title = json.title;
        this.#world = this.#jsonToWorld(json.world);
        this.#currentPatients = json.currentPatients.map(id => this.#world.getHumanById(id));
        this.#currentDay = json.currentDay;

        this.#world.allHumans.forEach(human => human.setSimulation(this));
    }

    #jsonToWorld(json) {
        json.humans.forEach(human => {
            human.parameters = this.#restoreStaticData(human.parameters);
        });

        return World.fromJson(json);
    }

    #restoreStaticData(parameter, parameterPath = null) {
        let descriptor = parameterPath === null
            ? this.#parameterFactory.parameterSetDescriptor
            : this.#parameterFactory.getParameterDescriptor(parameterPath);

        parameter.title = descriptor.title;

        if (parameter.className === 'CompositeParameter') {
            Object.entries(parameter.value).forEach(([childName, child]) => {
                let childPath = parameterPath === null
                    ? childName
                    : parameterPath + '.' + childName;

                parameter.value[childName] = this.#restoreStaticData(child, childPath);
            });
        }

        if (parameter.className === 'NumberParameter') {
            parameter.validRange = NumberRange.from(descriptor.validRange, NumberRange.POSITIVE);
            parameter.normalRange = NumberRange.from(descriptor.normalRange);
            parameter.viableRange = NumberRange.from(descriptor.viableRange);
            parameter.lethalRange = NumberRange.from(descriptor.lethalRange, null);
            parameter.randomType = descriptor.randomType ?? 'linear';
            parameter.randomOptions = descriptor.randomOptions ?? {};
        }

        if (parameter.className === 'EnumParameter') {
            parameter.allowedValues = descriptor.allowedValues ?? [];
        }

        return parameter;
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
