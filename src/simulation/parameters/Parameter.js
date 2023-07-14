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
        return this.constructor.fromJson(this.toJson());
    }

    update() {

    }

    randomize() {

    }

    toJson() {
        return {
            className: this.constructor.name,
            title: this.title,
            value: this.value,
        };
    }

    static fromJson(json) {
        return new Parameter(json);
    }
}
