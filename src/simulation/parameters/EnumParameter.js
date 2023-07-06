
import Parameter from './Parameter.js';
import Random from '../utils/Random.js';

export default class EnumParameter extends Parameter {

    #allowedValues;

    constructor(descriptor, value = null) {
        super(descriptor, value);

        this.#allowedValues = descriptor?.allowedValues || [];
    }

    set(newValue) {
        if (!this.#allowedValues.includes(newValue)) {
            throw new Error(`Invalid value "${newValue}" for parameter "${this.title}"`);
        }

        this.value = newValue;
    }

    get() {
        return this.value;
    }

    randomize() {
        this.set(Random.fromList(this.#allowedValues));
    }

    copy() {
        return new EnumParameter(this.descriptor, this.value);
    }
}
