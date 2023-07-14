
import Parameter from './Parameter';
import Random from '../utils/Random';

export default class EnumParameter extends Parameter {

    #allowedValues;

    constructor({allowedValues, ...options}) {
        super(options);

        this.#allowedValues = allowedValues ?? [];
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
        this.value = Random.fromList(this.#allowedValues);
    }

    toJson() {
        return {
            ...super.toJson(),
            allowedValues: this.#allowedValues,
        };
    }

    static fromJson(json) {
        return new EnumParameter(json);
    }
}
