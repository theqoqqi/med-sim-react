import Parameter from './Parameter';
import NumberRange from '../utils/NumberRange';
import RandomFunctions from '../utils/RandomFunctions';
import Fluctuation from './Fluctuation';

export default class NumberParameter extends Parameter {

    #validRange;

    #normalRange;

    #viableRange;

    #lethalRange;

    #randomType;

    #randomOptions;

    #fluctuation;

    #effects = new Map();

    constructor(descriptor, value = null) {
        super(descriptor, value);
        this.#validRange = descriptor.validRange ? NumberRange.from(descriptor.validRange) : NumberRange.POSITIVE;
        this.#normalRange = NumberRange.from(descriptor.normalRange);
        this.#viableRange = NumberRange.from(descriptor.viableRange);
        this.#lethalRange = descriptor.lethalRange ? NumberRange.from(descriptor.lethalRange) : null;
        this.#randomType = descriptor?.randomType ?? RandomFunctions.GAUSSIAN;
        this.#randomOptions = descriptor?.randomOptions ?? {};
        this.#fluctuation = new Fluctuation(this, descriptor?.fluctuation ?? {});
    }

    set value(value) {
        super.value = this.#validRange.clamp(value);
    }

    // Must be overridden in pair with setter
    get value() {
        return super.value;
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
        let randomValue;

        do {
            randomValue = RandomFunctions.randomInRange(this.normalRange, this.#randomType, this.#randomOptions);
        } while (!this.normalRange.includes(randomValue));

        this.value = randomValue;
        this.#fluctuation.reset();
    }

    get validRange() {
        return this.#validRange;
    }

    get normalRange() {
        return this.#normalRange;
    }

    get viableRange() {
        return this.#viableRange;
    }

    get lethalRange() {
        return this.#lethalRange;
    }

    isInNormalRange() {
        return this.#normalRange.includes(this.value);
    }

    isInViableRange() {
        return this.#viableRange.includes(this.value);
    }

    getDiscomfortLevel() {
        return NumberRange.getDistanceForValue(this.value, this.normalRange, this.viableRange);
    }

    getLethalityLevel() {
        if (!this.lethalRange) {
            return 0;
        }

        return NumberRange.getDistanceForValue(this.value, this.viableRange, this.lethalRange);
    }

    copy() {
        return new NumberParameter(this.descriptor, this.value);
    }
}
