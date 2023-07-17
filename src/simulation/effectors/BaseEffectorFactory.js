import ParameterEffect from '../parameters/ParameterEffect.js';
import Effector from './Effector.js';
import Disease from './diseases/Disease.js';
import Medication from './medications/Medication.js';
import DiseaseSource from './diseases/DiseaseSource.js';

export class BaseEffectorFactory {

    static #types = {
        [Effector.name]: Effector,
        [Disease.name]: Disease,
        [Medication.name]: Medication,
    };

    descriptorsByNames;

    descriptors;

    #parameterFactory;

    constructor(effectorDescriptors, parameterFactory) {
        this.descriptorsByNames = BaseEffectorFactory.#withNames(effectorDescriptors);
        this.descriptors = Object.values(effectorDescriptors);
        this.#parameterFactory = parameterFactory;

        this.#validateDescriptors();
    }

    #validateDescriptors() {
        let usedParameters = {};

        for (const descriptor of this.descriptors) {
            this.validateDescriptor(descriptor);

            this.#parameterFactory.flattenEffectImpacts(descriptor.effects, parameterPath => {
                usedParameters[parameterPath] = true;
            });
        }

        console.log(`List of parameters used by ${this.constructor.name}:`, Object.keys(usedParameters).sort());
    }

    validateDescriptor(descriptor) {
        BaseEffectorFactory.assertType(descriptor, 'title', 'string');
        BaseEffectorFactory.assertArray(descriptor, 'progressPerDay');
        BaseEffectorFactory.assertType(descriptor, 'impactFunction', 'string');
        BaseEffectorFactory.assertType(descriptor, 'effects', 'object');

        try {
            this.#parameterFactory.flattenEffectImpacts(descriptor.effects, () => {});
        } catch (e) {
            throw new TypeError(`${descriptor.name}.effects: ${e.message}`);
        }
    }

    static assertArray(descriptor, key) {
        if (!Array.isArray(descriptor[key])) {
            throw new TypeError(`${descriptor.name}[${key}] must be array`);
        }
    }

    static assertType(descriptor, key, type) {
        if (typeof descriptor[key] !== type) {
            throw new TypeError(`${descriptor.name}[${key}] must be of type '${type}'`);
        }
    }

    static assertTrue(descriptor, value, message) {
        if (!value) {
            throw new TypeError(`${descriptor.name}${message}`);
        }
    }

    static assertDiseaseSources(descriptor, key) {
        if (descriptor[key]) {
            BaseEffectorFactory.assertType(descriptor, key, 'object');

            for (const [sourceName, power] of Object.entries(descriptor[key])) {
                let source = DiseaseSource.byName(sourceName);

                BaseEffectorFactory.assertTrue(descriptor, source,
                    `.${key} contains invalid source: ${sourceName}`);
                BaseEffectorFactory.assertTrue(descriptor, typeof power === 'number',
                    `.${key} values must be numbers`);
            }
        }
    }

    get allDescriptorsByNames() {
        return this.descriptorsByNames;
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

    static getType(name) {
        return this.#types[name];
    }
}