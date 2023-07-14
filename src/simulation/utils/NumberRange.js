
export default class NumberRange {

    static INFINITE = new NumberRange(-Infinity, Infinity);

    static POSITIVE = new NumberRange(0, Infinity);

    static NEGATIVE = new NumberRange(-Infinity, 0);

    constructor(min, max) {
        this.min = min;
        this.max = max;
    }

    get average() {
        return (this.min + this.max) / 2;
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

    getDistance(value) {
        if (this.includes(value)) {
            return 0;
        }

        return value < this.min
            ? this.min - value
            : value - this.max;
    }

    toString() {
        return `${this.min}-${this.max}`;
    }

    toJson() {
        return [ this.min, this.max ];
    }

    static fromJson(json) {
        return this.from(json);
    }

    static of(min, max) {
        return new NumberRange(min, max);
    }

    static from(options, defaultRange = null) {
        if (!options) {
            return defaultRange;
        }

        if (options instanceof NumberRange) {
            return options;
        }

        if (options.length) {
            return new NumberRange(options[0], options[1]);
        }

        return new NumberRange(options.min, options.max);
    }

    static getDistanceForValue(value, fromRange, toRange) {
        if (fromRange.includes(value)) {
            return 0;
        }

        if (!toRange.includes(value)) {
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
