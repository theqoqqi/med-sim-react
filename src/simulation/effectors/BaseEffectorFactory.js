import ParameterEffect from '../parameters/ParameterEffect.js';

export class BaseEffectorFactory {

    allDescriptors;

    #parameterFactory;

    constructor(effectorDescriptors, parameterFactory) {
        this.allDescriptors = effectorDescriptors;
        this.#parameterFactory = parameterFactory;
    }

    /**
     * @return Effector
     * */
    createInstance(options) {
        throw new Error('Unsupported operation. This method must be overwritten in subclass.');
    }

    createByIndex(index) {
        const descriptor = this.allDescriptors[index];

        if (!descriptor) {
            throw new Error(`Descriptor with index ${index} not found.`);
        }

        return this.createFromDescriptor(descriptor);
    }

    createFromDescriptor(descriptor) {
        const effects = Object.entries(descriptor.effects)
            .flatMap(([parameterName, effectDescriptor]) => {
                return this.#createParameterEffects(parameterName, effectDescriptor);
            });

        return this.createInstance({
            ...descriptor,
            effects,
        });
    }

    #createParameterEffects(parameterPath, descriptor) {
        let parameterDescriptor = this.#parameterFactory.getParameterDescriptor(parameterPath);

        if (parameterDescriptor.type === 'number') {
            return [
                BaseEffectorFactory.#createNumberParameterEffect(descriptor, parameterPath)
            ];
        }

        if (parameterDescriptor.type === 'composite') {
            return this.#createCompositeParameterEffects(descriptor, parameterPath);
        }

        throw new Error('Invalid parameter: ' + parameterPath);
    }

    static #createNumberParameterEffect(descriptor, parameterName) {
        if (typeof descriptor === 'number') {
            return new ParameterEffect({
                parameterName,
                impact: descriptor,
            });
        }

        return new ParameterEffect({
            parameterName,
            ...descriptor,
        });
    }

    #createCompositeParameterEffects(descriptor, parameterPath) {
        return Object.entries(descriptor)
            .flatMap(([parameterName, effectDescriptor]) => {
                let combinedPath = parameterPath + '.' + parameterName;

                return this.#createParameterEffects(combinedPath, effectDescriptor);
            });
    }
}