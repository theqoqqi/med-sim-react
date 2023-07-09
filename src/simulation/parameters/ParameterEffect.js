
export default class ParameterEffect {

    constructor(parameterName, impact, easingFunction) {
        this.parameterName = parameterName;
        this.impact = impact;
        this.easingFunction = easingFunction;
    }

    applyTo(parameter, progress) {
        const value = this.impact * this.easingFunction(progress);

        parameter.setEffectValue(this, value);
    }

    removeFrom(parameter) {
        parameter.removeEffect(this);
    }
}
