import CompositeParameter from './CompositeParameter';
import NumberParameter from './NumberParameter';
import EnumParameter from './EnumParameter';

export default class ParameterFactory {

    #parameterSetDescriptor;

    #templateParameterSet;

    constructor(parameterSetDescriptor) {
        this.#parameterSetDescriptor = parameterSetDescriptor;
        this.#templateParameterSet = ParameterFactory.#createTemplate(parameterSetDescriptor);
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

        return new CompositeParameter(descriptor, childParameters);
    }
}