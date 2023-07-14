import ParameterEffect from '../parameters/ParameterEffect.js';

export class BaseEffectorFactory {

    descriptorsByNames;

    descriptors;

    #parameterFactory;

    constructor(effectorDescriptors, parameterFactory) {
        this.descriptorsByNames = BaseEffectorFactory.#withNames(effectorDescriptors);
        this.descriptors = Object.values(effectorDescriptors);
        this.#parameterFactory = parameterFactory;
    }

    get allDescriptors() {
        return this.descriptors;
    }

    /**
     * @return Effector
     * */
    createInstance(options) {
        throw new Error('Unsupported operation. This method must be overwritten in subclass.');
    }

    create(nameOrDescriptor) {
        return typeof nameOrDescriptor === 'string'
            ? this.createByName(nameOrDescriptor)
            : this.createFromDescriptor(nameOrDescriptor);
    }

    createByName(name) {
        let descriptor = this.descriptorsByNames[name];

        return this.createFromDescriptor(descriptor);
    }

    createFromDescriptor(descriptor) {
        const effects = this.#createCompositeParameterEffects(descriptor.effects);

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

    #createCompositeParameterEffects(descriptor, startPath = null) {
        return Object.entries(descriptor)
            .flatMap(([parameterName, effectDescriptor]) => {
                let combinedPath = startPath
                    ? startPath + '.' + parameterName
                    : parameterName;

                return this.#createParameterEffects(combinedPath, effectDescriptor);
            });
    }

    static #withNames(descriptors) {
        for (const [name, descriptor] of Object.entries(descriptors)) {
            descriptor.name = name;
        }

        return descriptors;
    }
}