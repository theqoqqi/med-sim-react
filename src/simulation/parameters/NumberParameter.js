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

    constructor({
        validRange,
        normalRange,
        viableRange,
        lethalRange,
        randomType,
        randomOptions,
        fluctuation,
        ...options
    }) {
        super(options);

        this.#validRange = NumberRange.from(validRange, NumberRange.POSITIVE);
        this.#normalRange = NumberRange.from(normalRange);
        this.#viableRange = NumberRange.from(viableRange);
        this.#lethalRange = NumberRange.from(lethalRange, null);
        this.#randomType = randomType ?? RandomFunctions.GAUSSIAN;
        this.#randomOptions = randomOptions ?? {};
        this.#fluctuation = Fluctuation.from(this, fluctuation);
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

    get randomType() {
        return this.#randomType;
    }

    get randomOptions() {
        return this.#randomOptions;
    }

    get fluctuation() {
        return this.#fluctuation;
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
        return new NumberParameter({
            title: this.title,
            value: this.value,
            viableRange: this.viableRange,
            normalRange: this.normalRange,
            validRange: this.validRange,
            lethalRange: this.lethalRange,
            randomType: this.randomType,
            randomOptions: this.randomOptions,
            fluctuation: this.fluctuation,
        });
    }
}
