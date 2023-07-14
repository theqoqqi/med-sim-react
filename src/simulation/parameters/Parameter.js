
export default class Parameter {

    #title;

    #value;

    constructor({ title, value }) {
        this.#title = title;
        this.#value = value;
    }

    get value() {
        return this.#value;
    }

    set value(value) {
        this.#value = value;
    }

    get title() {
        return this.#title;
    }

    isInNormalRange() {
        return true;
    }

    isInViableRange() {
        return true;
    }

    getDiscomfortLevel() {
        return 0;
    }

    getLethalityLevel() {
        return 0;
    }

    copy() {
        return new Parameter({
            title: this.title,
            value: this.value,
        });
    }

    update() {

    }

    randomize() {

    }
}
