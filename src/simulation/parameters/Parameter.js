
export default class Parameter {

    #value;

    constructor(descriptor, value) {
        this.descriptor = descriptor;
        this.#value = value;
    }

    get value() {
        return this.#value;
    }

    set value(value) {
        this.#value = value;
    }

    get title() {
        return this.descriptor.title;
    }

    isInNormalRange() {
        return true;
    }

    isInViableRange() {
        return true;
    }

    copy() {
        return new Parameter(this.descriptor, this.value);
    }

    update() {

    }

    randomize() {

    }
}
