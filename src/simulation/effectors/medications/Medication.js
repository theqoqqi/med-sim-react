import Effector from '../Effector.js';

export default class Medication extends Effector {

    #sourceEffects;

    constructor({ sourceEffects, ...options }) {
        super(options);

        this.#sourceEffects = Medication.#createEffectMap(sourceEffects);
    }

    get sourceEffects() {
        return this.#sourceEffects;
    }

    update() {
        super.update();

        this.#cureDiseases();
    }

    #cureDiseases() {
        this.human.diseases.forEach(disease => {
            this.#cureDisease(disease);
        });
    }

    #cureDisease(disease) {
        let powerMultiplier = this.lastProgressPerDay;

        this.#sourceEffects.forEach((power, effectName) => {
            disease.cureSource(effectName, power * powerMultiplier);
        });
    }

    static #createEffectMap(sourceEffects) {
        return Object.entries(sourceEffects ?? {})
            .reduce((map, [sourceName, power]) => map.set(sourceName, power), new Map());
    }

    toJson() {
        return {
            ...super.toJson(),
            sourceEffects: Object.fromEntries(this.#sourceEffects),
        };
    }

    static fromJson(json) {
        return new Medication(json);
    }
}