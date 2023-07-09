import Effector from './Effector';

export default class Medication extends Effector {

    #sourceEffects;

    constructor(descriptor, human, effects) {
        super(descriptor, human, effects);

        this.#sourceEffects = Medication.#createEffectMap(descriptor);
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

    static #createEffectMap(descriptor) {
        return Object.entries(descriptor?.sourceEffects ?? {})
            .reduce((map, [sourceName, power]) => map.set(sourceName, power), new Map());
    }
}
