
import RandomFunctions from '../utils/RandomFunctions';

export default class Fluctuation {

    static #presets = new Map([
        ['zero', {
            daysBetweenTargetUpdates: [1, 1],
            stepSizeInPercents: 0
        }],
        ['low', {
            daysBetweenTargetUpdates: [8, 12],
            stepSizeInPercents: 0.01
        }],
        ['medium', {
            daysBetweenTargetUpdates: [4, 6],
            stepSizeInPercents: 0.05
        }],
        ['high', {
            daysBetweenTargetUpdates: [1, 2],
            stepSizeInPercents: 0.25
        }],
    ]);

    constructor(parameter, descriptor) {
        this.parameter = parameter;
        this.daysBetweenTargetUpdates = descriptor?.daysBetweenTargetUpdates ?? [1, 1];
        this.remainingDays = this.daysBetweenTargetUpdates;
        this.stepSizeInPercents = descriptor?.stepSizeInPercents ?? 0;
        this.stepSize = null;
    }

    update() {
        if (this.remainingDays <= 0) {
            this.#updateTarget();
        }

        const stepSize = this.getRandomStepSize();
        const newValue = this.parameter.get() + stepSize;

        this.parameter.set(newValue);
        this.remainingDays--;
    }

    getRandomStepSize() {
        return this.stepSize * RandomFunctions.gaussian(1, 0.2);
    }

    #updateTarget() {
        let targetValue = this.parameter.normalRange.random();

        this.remainingDays = this.daysBetweenTargetUpdates.randomInt();
        this.stepSize = (targetValue - this.parameter.get()) * this.stepSizeInPercents;
    }

    static getPreset(presetName) {
        return this.#presets.get(presetName) ?? this.#presets.get('zero');
    }
}
