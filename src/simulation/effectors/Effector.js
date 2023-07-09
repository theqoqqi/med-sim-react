
import Easing from '../utils/Easing';
import NumberRange from '../utils/NumberRange';

export default class Effector {

    constructor(descriptor, human, effects) {
        this.human = human;
        this.title = descriptor.title;
        this.effects = effects;
        this.progressPerDay = NumberRange.from(descriptor.progressPerDay);
        this.progress = 0;
        this.impactFunction = this.getImpactFunction(descriptor);
        this.impact = 0;
    }

    getImpactFunction(descriptor) {
        let functionName = descriptor?.impactFunction ?? 'linear';
        let options = descriptor?.impactFunctionOptions ?? {};

        return Easing.getFunction(functionName, options);
    }

    start() {
        this.setProgress(0);
        this.applyEffects();
    }

    update() {
        this.addProgress(this.progressPerDay.random());
        this.applyEffects();
    }

    destroy() {
        this.removeEffects();
    }

    isFinished() {
        return this.progress > 0 && this.impact <= 0;
    }

    addProgress(progress) {
        this.setProgress(this.progress + progress);
    }

    setProgress(progress) {
        this.progress = progress;
        this.impact = this.impactFunction(progress);
    }

    applyEffects() {
        for (const effect of this.effects) {
            let parameter = this.human.getParameter(effect.parameterName);

            effect.applyTo(parameter, this.impact);
        }
    }

    removeEffects() {
        for (const effect of this.effects) {
            let parameter = this.human.getParameter(effect.parameterName);

            effect.removeFrom(parameter);
        }
    }
}
