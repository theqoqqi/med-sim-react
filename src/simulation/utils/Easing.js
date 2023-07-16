
export default class Easing {

    static linear(progress) {
        return progress;
    }

    static inverseLinear(progress) {
        return 1 - progress;
    }

    static quadratic(progress) {
        return progress ** 2;
    }

    static squareRoot(x) {
        return Math.sqrt(x);
    }

    static power(x, { power = 1 }) {
        return Math.pow(x, power);
    }

    static gaussian(progress, { power = 2, meanOrigin = 0.5, deviationFactor = 0.08 }) {
        return Math.exp(-Math.pow(progress - meanOrigin, power) / deviationFactor);
    }

    static getFunction(functionName, predefinedOptions = {}) {
        predefinedOptions ??= {};

        let func = Easing[functionName];

        return (progress, options) => {
            return func(progress, { ...predefinedOptions, ...options });
        };
    }
}
