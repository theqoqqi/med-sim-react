
let nextId = 1;

export default class Human {

    static #AGE_PARAMETER_PATH = 'physical.age';

    #id;

    #name;

    #parameters;

    #diseases;

    #stateHistory;

    constructor(name, parameters) {
        this.#id = nextId++;
        this.#name = name;
        this.#parameters = parameters;
        this.#diseases = [];
        this.#stateHistory = [];

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
        return true;
    }

    update() {
        this.age += 1 / 365;

        this.#parameters.update();

        this.#diseases.forEach(d => d.update());

        this.#diseases.filter(d => d.isFinished())
            .forEach(d => this.removeDisease(d));

        this.#pushHistory();
    }

    #pushHistory() {
        let snapshot = {};

        this.#parameters.forEachRecursive((parameter, parameterPath) => {
            snapshot[parameterPath] = parameter.value;
        });

        this.#stateHistory.push(snapshot);
    }

    addDiseases(diseases) {
        diseases.forEach(disease => this.addDisease(disease));
    }

    addDisease(disease) {
        this.#diseases.push(disease);

        disease.start();
    }

    removeDisease(disease) {
        let index = this.#diseases.indexOf(disease);

        if (index !== -1) {
            this.#diseases.splice(disease, 1);
        }
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
