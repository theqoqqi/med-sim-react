import Easing from '../utils/Easing';
import NumberRange from '../utils/NumberRange';
import ParameterEffect from '../parameters/ParameterEffect.js';

export default class Effector {

    #impactFunctionInstance;

    constructor({
        title,
        effects,
        progress = 0,
        progressPerDay,
        lastProgressPerDay = 0,
        impact = 0,
        impactFunction,
        impactFunctionOptions
    }) {
        this.human = null;
        this.title = title;
        this.effects = effects.map(e => ParameterEffect.fromJson(e));
        this.progress = progress;
        this.progressPerDay = NumberRange.from(progressPerDay);
        this.lastProgressPerDay = lastProgressPerDay;
        this.impact = impact;
        this.impactFunction = impactFunction;
        this.impactFunctionOptions = impactFunctionOptions;
        this.#impactFunctionInstance = this.getImpactFunction(impactFunction, impactFunctionOptions);
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

    toJson() {
        return {
            className: this.constructor.name,
            title: this.title,
            effects: this.effects.map(e => e.toJson()),
            progress: this.progress,
            progressPerDay: this.progressPerDay.toJson(),
            lastProgressPerDay: this.lastProgressPerDay,
            impact: this.impact,
            impactFunction: this.impactFunction,
            impactFunctionOptions: this.impactFunctionOptions,
        };
    }

    static fromJson(json) {
        return new Effector(json);
    }
}
