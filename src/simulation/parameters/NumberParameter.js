
import Parameter from './Parameter.js';
import NumberRange from '../utils/NumberRange.js';
import RandomFunctions from '../utils/RandomFunctions.js';
import Fluctuation from './Fluctuation.js';

export default class NumberParameter extends Parameter {

    #normalRange;

    #viableRange;

    #randomType;

    #randomOptions;

    #fluctuation;

    #effects = new Map();

    constructor(descriptor, value = null) {
        super(descriptor, value);
        this.#normalRange = NumberRange.from(descriptor.normalRange);
        this.#viableRange = NumberRange.from(descriptor.viableRange);
        this.#randomType = descriptor?.randomType ?? RandomFunctions.GAUSSIAN;
        this.#randomOptions = descriptor?.randomOptions ?? {};
        this.#fluctuation = new Fluctuation(this, descriptor?.fluctuation ?? {});
    }

    set(newValue) {
        this.value = newValue;
    }

    get() {
        return this.value;
    }

    update() {
        this.#fluctuation.update();
    }

    setEffectValue(effect, value) {
        let oldValue = this.getEffectValue(effect);
        let changedBy = value - oldValue;

        this.value += changedBy;
        this.#effects.set(effect, value);
    }

    removeEffect(effect) {
        let value = this.getEffectValue(effect);

        this.value -= value;
        this.#effects.delete(effect);
    }

    getEffectValue(effect) {
        return this.#effects.has(effect)
            ? this.#effects.get(effect)
            : 0;
    }

    randomize() {
        let randomValue = RandomFunctions.randomInRange(this.normalRange, this.#randomType, this.#randomOptions);
        let clampedValue = this.viableRange.clamp(randomValue);

        this.set(clampedValue);
    }

    get normalRange() {
        return this.#normalRange;
    }

    get viableRange() {
        return this.#viableRange;
    }

    isInNormalRange() {
        return this.#normalRange.includes(this.value);
    }

    isInViableRange() {
        return this.#viableRange.includes(this.value);
    }

    copy() {
        return new NumberParameter(this.descriptor, this.value);
    }
}
