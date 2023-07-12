import NumberParameter from '../parameters/NumberParameter.js';
import CompositeParameter from '../parameters/CompositeParameter.js';
import ParameterEffect from '../parameters/ParameterEffect.js';
import Easing from '../utils/Easing.js';

export class BaseEffectorFactory {

    allDescriptors;

    constructor(effectorDescriptors) {
        this.allDescriptors = effectorDescriptors;
    }

    /**
     * @return Effector
     * */
    createInstance(descriptor, human, effects) {
        throw new Error('Unsupported operation. This method must be overwritten in subclass.');
    }

    createByIndex(human, index) {
        const descriptor = this.allDescriptors[index];

        if (!descriptor) {
            throw new Error(`Descriptor with index ${index} not found.`);
        }

        return this.createFromDescriptor(human, descriptor);
    }

    createFromDescriptor(human, descriptor) {
        const effects = Object.entries(descriptor.effects)
            .flatMap(([parameterName, effectDescriptor]) => {
                return this.createParameterEffects(human, parameterName, effectDescriptor);
            });

        return this.createInstance(descriptor, human, effects);
    }

    createParameterEffects(human, parameterPath, descriptor) {
        let parameter = human.getParameter(parameterPath);

        if (parameter instanceof NumberParameter) {
            return [
                this.createNumberParameterEffect(descriptor, parameterPath)
            ];
        }

        if (parameter instanceof CompositeParameter) {
            return Object.entries(descriptor)
                .flatMap(([parameterName, effectDescriptor]) => {
                    let combinedPath = parameterPath + '.' + parameterName;

                    return this.createParameterEffects(human, combinedPath, effectDescriptor);
                });
        }

        throw new Error('Invalid parameter: ' + parameterPath);
    }

    createNumberParameterEffect(descriptor, parameterName) {
        if (typeof descriptor === 'number') {
            return new ParameterEffect(parameterName, descriptor, Easing.linear);
        }

        let easingFunction = Easing.getFunction(descriptor.easingFunction, descriptor.easingFunctionOptions);

        return new ParameterEffect(parameterName, descriptor.impact, easingFunction);
    }
}