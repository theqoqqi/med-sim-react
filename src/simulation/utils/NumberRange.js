
export default class NumberRange {

    static INFINITE = new NumberRange(-Infinity, Infinity);

    static POSITIVE = new NumberRange(0, Infinity);

    static NEGATIVE = new NumberRange(-Infinity, 0);

    constructor(min, max) {
        this.min = min;
        this.max = max;
    }

    includes(value) {
        return value >= this.min && value <= this.max;
    }

    clamp(value) {
        if (value < this.min) {
            return this.min;
        }

        if (value > this.max) {
            return this.max;
        }

        return value;
    }

    random() {
        return this.min + Math.random() * (this.max - this.min);
    }

    randomInt() {
        return this.min + Math.floor(Math.random() * (this.max - this.min + 1));
    }

    toString() {
        return `${this.min}-${this.max}`;
    }

    static of(min, max) {
        return new NumberRange(min, max);
    }

    static from(array) {
        return new NumberRange(array[0], array[1]);
    }

    static getDistanceForValue(value, fromRange, toRange) {
        if (fromRange.includes(value)) {
            return 0;
        }

        if (toRange.includes(value)) {
            return 1;
        }

        const distanceFromInner = Math.min(
            Math.abs(value - fromRange.min),
            Math.abs(value - fromRange.max)
        );

        const distanceFromOuter = Math.min(
            Math.abs(value - toRange.min),
            Math.abs(value - toRange.max)
        );

        return distanceFromInner / (distanceFromInner + distanceFromOuter);
    }
}
