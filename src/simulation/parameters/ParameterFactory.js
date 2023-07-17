import CompositeParameter from './CompositeParameter';
import NumberParameter from './NumberParameter';
import EnumParameter from './EnumParameter';
import Parameter from './Parameter.js';
import Iterate from '../utils/Iterate.js';

export default class ParameterFactory {

    static #types = {
        [Parameter.name]: Parameter,
        [CompositeParameter.name]: CompositeParameter,
        [NumberParameter.name]: NumberParameter,
        [EnumParameter.name]: EnumParameter,
    };

    #parameterSetDescriptor;

    #templateParameterSet;

    constructor(parameterSetDescriptor) {
        this.#parameterSetDescriptor = parameterSetDescriptor;
        this.#templateParameterSet = ParameterFactory.#createTemplate(parameterSetDescriptor);
    }

    get parameterSetDescriptor() {
        return this.#parameterSetDescriptor;
    }

    createParameters() {
        let parameters = this.#templateParameterSet.copy();

        parameters.randomize();

        return parameters;
    }

    flattenEffectImpacts(effects, mapper = null, startPath = null) {
        return Iterate.flattenHierarchy({
            ...this.createFlattenEffectsOptions(effects, startPath),
            mapper,
        });
    }

    iterateEffectImpacts(effects, callback, startPath = null) {
        Iterate.iterateHierarchy({
            ...this.createFlattenEffectsOptions(effects, startPath),
            callback: (effectDescriptor, parameterPath) => {
                let impact = typeof effectDescriptor === 'object'
                    ? effectDescriptor?.impact
                    : effectDescriptor;

                callback?.(impact, parameterPath);
            },
        });
    }

    createFlattenEffectsOptions(effects, startPath = null) {
        return {
            root: effects,
            includeParents: false,
            startPath,
            isParent: (child, childPath) => {
                return this.isCompositeDescriptor(childPath);
            },
            getChildren: parent => parent,
        };
    }

    isCompositeDescriptor(childPath) {
        return ParameterFactory.isCompositeDescriptor(this.#parameterSetDescriptor, childPath);
    }

    static isCompositeDescriptor(parameterSetDescriptor, parameterPath) {
        let descriptor = ParameterFactory.getParameterDescriptorByPath(parameterSetDescriptor, parameterPath);

        if (!descriptor) {
            throw new Error(`Unknown parameter: ${parameterPath}`);
        }

        return descriptor.type === 'composite';
    }

    getParameterDescriptor(parameterPath) {
        return ParameterFactory.getParameterDescriptorByPath(this.#parameterSetDescriptor, parameterPath);
    }

    static getParameterDescriptorByPath(object, path) {
        if (!path) {
            return object;
        }

        const parts = path.split('.');
        const lastPart = parts.pop();

        for (const part of parts) {
            object = object?.parameters[part];

            if (!object) {
                return null;
            }
        }

        return object?.parameters[lastPart];
    }

    static #createTemplate(descriptor) {
        return ParameterFactory.#createParameter(descriptor);
    }

    static #createParameter(descriptor) {
        if (descriptor.type === 'number') {
            return ParameterFactory.#createNumberParameter(descriptor);
        }

        if (descriptor.type === 'composite') {
            return ParameterFactory.#createCompositeParameter(descriptor);
        }

        if (descriptor.type === 'enum') {
            return ParameterFactory.#createEnumParameter(descriptor);
        }

        throw new Error('Unsupported parameter type: ' + descriptor.type);
    }

    static #createNumberParameter(descriptor) {
        return new NumberParameter(descriptor);
    }

    static #createEnumParameter(descriptor) {
        return new EnumParameter(descriptor);
    }

    static #createCompositeParameter(descriptor) {
        let childParameters = {};

        for (let [parameterName, parameterDescriptor] of Object.entries(descriptor.parameters)) {
            childParameters[parameterName] = ParameterFactory.#createParameter(parameterDescriptor);
        }

        return new CompositeParameter({
            title: descriptor.title,
            value: childParameters,
        });
    }

    static getType(name) {
        return this.#types[name];
    }
}