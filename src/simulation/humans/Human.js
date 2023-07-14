import Random from '../utils/Random.js';
import Disease from '../effectors/diseases/Disease.js';
import Medication from '../effectors/medications/Medication.js';
import Name from './Name.js';
import TreatmentCourse from '../TreatmentCourse.js';
import {BaseEffectorFactory} from '../effectors/BaseEffectorFactory.js';
import ParameterFactory from '../parameters/ParameterFactory.js';

export default class Human {

    static #AGE_PARAMETER_PATH = 'physical.age';

    #id;

    #simulation = null;

    #name;

    #parameters;

    #effectors = [];

    #treatmentCourses = [];

    #isAlive;

    #aliveDays;

    #lethalParameter;

    #stateHistory;

    #diseaseSourceImmunities = new Map([
        ['viralInfection', 0.05],
        ['bacterialInfection', 0.05],
        ['inflammatory', 0.05],
        ['autoimmuneDisorders', 0.05],
        ['geneticDisorders', 0.05],
    ]);

    constructor({
        id,
        name,
        parameters,
        effectors = [],
        treatmentCourses = [],
        isAlive = true,
        aliveDays = 0,
        lethalParameter,
        stateHistory = null
    }) {
        this.#id = id;
        this.#name = Name.from(name);
        this.#parameters = parameters;
        this.#isAlive = isAlive;
        this.#aliveDays = aliveDays;
        this.#lethalParameter = lethalParameter;
        this.#stateHistory = stateHistory ?? this.createStateHistory();

        this.addEffectors(effectors);
        this.addTreatmentCourses(treatmentCourses);
    }

    createStateHistory() {
        let history = {};

        this.#parameters.forEachRecursive((parameter, parameterPath) => {
            history[parameterPath] = [parameter.value];
        });

        return history;
    }

    setSimulation(simulation) {
        this.#simulation = simulation;
    }

    get id() {
        return this.#id;
    }

    get simulation() {
        return this.#simulation;
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

    get treatmentCourses() {
        return this.#treatmentCourses;
    }

    update() {
        if (!this.isAlive) {
            return;
        }

        this.#aliveDays++;
        this.#updateAge();
        this.#updateImmunity();
        this.#updateTreatmentCourses();
        this.#updateParameters();
        this.#updateEffectors();
        this.#updateAliveState();
        this.#pushHistory();
    }

    #updateAge() {
        this.age += 1 / 365;
    }

    #updateImmunity() {
        this.diseases.forEach(disease => {
            this.#cureDisease(disease);
        });
    }

    #cureDisease(disease) {
        let powerMultiplier = 1;

        this.#diseaseSourceImmunities.forEach((power, diseaseSourceName) => {
            disease.cureSource(diseaseSourceName, power * powerMultiplier);
        });
    }

    #updateTreatmentCourses() {
        this.#treatmentCourses.forEach(c => c.update());

        this.#treatmentCourses.filter(c => c.isFinished)
            .forEach(c => this.removeTreatmentCourse(c));
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
        this.#parameters.forEachRecursive((parameter, parameterPath) => {
            this.#stateHistory[parameterPath].push(parameter.value);
        });
    }

    addEffectors(effectors) {
        effectors.forEach(effector => this.addEffector(effector));
    }

    addEffector(effector) {
        this.#effectors.push(effector);

        effector.setHuman(this);
        effector.applyEffects();
    }

    removeEffector(effector) {
        let index = this.#effectors.indexOf(effector);

        if (index !== -1) {
            this.#effectors.splice(effector, 1);
        }

        effector.removeEffects();
    }

    addTreatmentCourses(courses) {
        courses.forEach(course => this.addTreatmentCourse(course));
    }

    addTreatmentCourse(course) {
        this.#treatmentCourses.push(course);

        course.setPatient(this);
    }

    removeTreatmentCourse(course) {
        let index = this.#treatmentCourses.indexOf(course);

        if (index !== -1) {
            this.#treatmentCourses.splice(course, 1);
        }
    }

    getMaxDiseaseSourcePower(sourceName) {
        let sourcePowers = this.diseases.map(disease => disease.getSourcePower(sourceName));

        return Math.max(0, ...sourcePowers);
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

    toJson() {
        return {
            id: this.id,
            name: this.#name.toJson(),
            parameters: this.parameters.toJson(),
            effectors: this.#effectors.map(e => e.toJson()),
            treatmentCourses: this.treatmentCourses.map(c => c.toJson()),
            isAlive: this.isAlive,
            aliveDays: this.aliveDays,
            lethalParameter: this.lethalParameter?.toJson(),
            stateHistory: Human.#packHistory(this.stateHistory),
        };
    }

    static #packHistory(stateHistory) {
        return Object.values(stateHistory);
    }

    static fromJson(json) {
        let parameters = ParameterFactory.getType(json.parameters.className).fromJson(json.parameters);

        return new Human({
            ...json,
            parameters,
            effectors: json.effectors.map(e => BaseEffectorFactory.getType(e.className).fromJson(e)),
            treatmentCourses: json.treatmentCourses.map(c => TreatmentCourse.fromJson(c)),
            lethalParameter: ParameterFactory.getType(json?.lethalParameter?.className)?.fromJson(json.lethalParameter),
            stateHistory: this.#unpackHistory(parameters, json.stateHistory),
        });
    }

    static #unpackHistory(parameters, stateHistory) {
        let unpacked = {};
        let index = 0;

        parameters.forEachRecursive((parameter, parameterPath) => {
            unpacked[parameterPath] = stateHistory[index++];
        });

        return unpacked;
    }
}
