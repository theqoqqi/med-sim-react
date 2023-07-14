import RandomFunctions from '../utils/RandomFunctions';
import NumberRange from '../utils/NumberRange.js';

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

    constructor({ parameter, daysBetweenTargetUpdates, stepSizeInPercents }) {
        this.parameter = parameter;
        this.daysBetweenTargetUpdates = NumberRange.from(daysBetweenTargetUpdates ?? [1, 1]);
        this.remainingDays = null;
        this.stepSizeInPercents = stepSizeInPercents ?? 0;
        this.stepSize = null;

        this.reset();
    }

    setParameter(parameter) {
        this.parameter = parameter;
    }

    reset() {
        this.#updateTarget();
    }

    update() {
        if (this.remainingDays <= 0) {
            this.#updateTarget();
        }

        let gaussian = RandomFunctions.gaussian(1, 0.2);
        const stepSize = this.stepSize * gaussian;

        this.parameter.value = this.parameter.value + stepSize;
        this.remainingDays--;
    }

    getRandomStepSize() {
        return this.stepSize * RandomFunctions.gaussian(1, 0.2);
    }

    #updateTarget() {
        let targetValue = this.parameter.normalRange.random();

        this.remainingDays = this.daysBetweenTargetUpdates.randomInt();
        this.stepSize = (targetValue - this.parameter.value) * this.stepSizeInPercents;
    }

    toJson() {
        return {
            daysBetweenTargetUpdates: this.daysBetweenTargetUpdates.toJson(),
            remainingDays: this.remainingDays,
            stepSizeInPercents: this.stepSizeInPercents,
            stepSize: this.stepSize,
        };
    }

    static fromJson(json) {
        return new Fluctuation(json);
    }

    static from(parameter, options) {
        if (typeof options === 'string') {
            options = this.getPreset(options);
        }

        return new Fluctuation({
            parameter,
            ...options,
        });
    }

    static getPreset(presetName) {
        return this.#presets.get(presetName) ?? this.#presets.get('zero');
    }
}
