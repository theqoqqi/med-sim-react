import CompositeParameter from './CompositeParameter';
import NumberParameter from './NumberParameter';
import EnumParameter from './EnumParameter';
import Parameter from './Parameter.js';

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

    mapEffects(effects, callback, startPath = null) {
        let parameterDescriptors = this.#parameterSetDescriptor.parameters;

        return Object.entries(effects)
            .flatMap(([parameterPath, effectDescriptor]) => {
                if (startPath) {
                    parameterPath = startPath + '.' + parameterPath;
                }

                let parameterDescriptor = this.getParameterDescriptorByPath(parameterDescriptors, parameterPath);

                if (!parameterDescriptor) {
                    throw new Error(`Unknown parameter: ${parameterPath}`);
                }

                if (parameterDescriptor.type === 'composite') {
                    return this.mapEffects(effectDescriptor, callback, parameterPath);
                }

                let value = typeof effectDescriptor === 'object'
                    ? effectDescriptor?.impact
                    : effectDescriptor;

                return callback(parameterPath, value);
            });
    }

    getParameterDescriptor(parameterPath) {
        return this.getParameterDescriptorByPath(this.#parameterSetDescriptor.parameters, parameterPath);
    }

    getParameterDescriptorByPath(object, path) {
        const parts = path.split('.');
        const lastPart = parts.pop();

        for (const part of parts) {
            object = object[part]?.parameters;

            if (!object) {
                return null;
            }
        }

        return object[lastPart];
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