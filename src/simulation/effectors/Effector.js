
import Easing from '../utils/Easing';
import NumberRange from '../utils/NumberRange';

export default class Effector {

    #impactFunctionInstance;

    constructor({ title, effects, progressPerDay, impactFunction, impactFunctionOptions }) {
        this.human = null;
        this.title = title;
        this.effects = effects;
        this.lastProgressPerDay = 0;
        this.progressPerDay = NumberRange.from(progressPerDay);
        this.progress = 0;
        this.impactFunction = impactFunction;
        this.impactFunctionOptions = impactFunctionOptions;
        this.#impactFunctionInstance = this.getImpactFunction(impactFunction, impactFunctionOptions);
        this.impact = 0;
    }

    get impactMultiplier() {
        return 1;
    }

    getImpactFunction(functionName, options) {
        functionName ??= 'linear';
        options ??= {};

        return Easing.getFunction(functionName, options);
    }

    setHuman(human) {
        this.human = human;
    }

    update() {
        this.lastProgressPerDay = this.progressPerDay.random();

        this.addProgress(this.lastProgressPerDay);
        this.applyEffects();
    }

    isFinished() {
        return this.progress > 0 && this.impact * this.impactMultiplier <= 0.000001;
    }

    addProgress(progress) {
        this.setProgress(this.progress + progress);
    }

    setProgress(progress) {
        this.progress = progress;
        this.impact = this.#impactFunctionInstance(progress);
    }

    applyEffects() {
        for (const effect of this.effects) {
            let parameter = this.human.getParameter(effect.parameterName);

            effect.applyTo(parameter, this.impact * this.impactMultiplier);
        }
    }

    removeEffects() {
        for (const effect of this.effects) {
            let parameter = this.human.getParameter(effect.parameterName);

            effect.removeFrom(parameter);
        }
    }
}
