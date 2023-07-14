import Easing from '../utils/Easing.js';

export default class ParameterEffect {

    #easingFunctionInstance;

    constructor({ parameterName, impact, easingFunction, easingFunctionOptions }) {
        this.parameterName = parameterName;
        this.impact = impact;
        this.easingFunction = easingFunction;
        this.easingFunctionOptions = easingFunctionOptions;
        this.#easingFunctionInstance = this.getEasingFunction(easingFunction, easingFunctionOptions);
    }

    getEasingFunction(functionName, options) {
        functionName ??= 'linear';

        return Easing.getFunction(functionName, options);
    }

    applyTo(parameter, progress) {
        const value = this.impact * this.#easingFunctionInstance(progress);

        parameter.setEffectValue(this, value);
    }

    removeFrom(parameter) {
        parameter.removeEffect(this);
    }

    toJson() {
        return {
            parameterName: this.parameterName,
            impact: this.impact,
            easingFunction: this.easingFunction,
            easingFunctionOptions: this.easingFunctionOptions,
        };
    }

    static fromJson(json) {
        return new ParameterEffect(json);
    }
}
