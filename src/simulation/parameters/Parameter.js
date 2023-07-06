
export default class Parameter {

    constructor(descriptor, value) {
        this.descriptor = descriptor;
        this.value = value;
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
