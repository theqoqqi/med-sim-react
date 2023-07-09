import Random from '../utils/Random.js';
import Disease from '../effectors/Disease.js';
import Medication from '../effectors/Medication.js';

let nextId = 1;

export default class Human {

    static #AGE_PARAMETER_PATH = 'physical.age';

    #id;

    #aliveDays = 0;

    #name;

    #parameters;

    #effectors = [];

    #isAlive = true;

    #lethalParameter;

    #stateHistory = [];

    constructor(name, parameters) {
        this.#id = nextId++;
        this.#name = name;
        this.#parameters = parameters;

        this.#pushHistory();
    }

    get id() {
        return this.#id;
    }

    get fullName() {
        return this.#name.fullName;
    }

    get parameters() {
        return this.#parameters;
    }

    set age(value) {
        return this.setParameterValue(Human.#AGE_PARAMETER_PATH, value);
    }

    get age() {
        return this.getParameterValue(Human.#AGE_PARAMETER_PATH);
    }

    get stateHistory() {
        return this.#stateHistory;
    }

    get isAlive() {
        return this.#isAlive;
    }

    get aliveDays() {
        return this.#aliveDays;
    }

    get lethalParameter() {
        return this.#lethalParameter;
    }

    get diseases() {
        return this.#effectors.filter(e => e instanceof Disease);
    }

    get medications() {
        return this.#effectors.filter(e => e instanceof Medication);
    }

    update() {
        if (!this.isAlive) {
            return;
        }

        this.#aliveDays++;
        this.#updateAge();
        this.#updateParameters();
        this.#updateEffectors();
        this.#updateAliveState();
        this.#pushHistory();
    }

    #updateAge() {
        this.age += 1 / 365;
    }

    #updateParameters() {
        this.#parameters.update();
    }

    #updateEffectors() {
        this.#effectors.forEach(d => d.update());

        this.#effectors.filter(d => d.isFinished())
            .forEach(d => this.removeEffector(d));
    }

    #updateAliveState() {
        let lethalityLevel = this.#parameters.getLethalityLevel();
        let isDead = Math.random() < lethalityLevel;

        this.#isAlive = !isDead;

        if (isDead) {
            let lethalEntries = this.#parameters.mapRecursive(parameter => {
                return {
                    parameter,
                    lethality: parameter.getLethalityLevel(),
                };
            });
            let randomEntry = Random.weightedByField(lethalEntries, 'lethality');

            this.#lethalParameter = randomEntry.parameter;
        }
    }

    #pushHistory() {
        let snapshot = {};

        this.#parameters.forEachRecursive((parameter, parameterPath) => {
            snapshot[parameterPath] = parameter.value;
        });

        this.#stateHistory.push(snapshot);
    }

    addEffectors(effectors) {
        effectors.forEach(effector => this.addEffector(effector));
    }

    addEffector(effector) {
        this.#effectors.push(effector);

        effector.start();
    }

    removeEffector(effector) {
        let index = this.#effectors.indexOf(effector);

        if (index !== -1) {
            this.#effectors.splice(effector, 1);
        }
    }

    getDiscomfortLevel() {
        return this.#parameters.getDiscomfortLevel();
    }

    setParameterValue(path, newValue) {
        this.#parameters.setParameterValue(path, newValue);
    }

    getParameterValue(path) {
        return this.#parameters.getParameterValue(path);
    }

    getParameter(path) {
        return this.#parameters.getParameter(path);
    }
}
