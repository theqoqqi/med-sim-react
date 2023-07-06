import CompositeParameter from './CompositeParameter.js';
import NumberParameter from './NumberParameter.js';
import EnumParameter from './EnumParameter.js';

export default class ParameterFactory {

    #templateParameterSet;

    constructor(parameterSetDescriptor) {
        this.#templateParameterSet = ParameterFactory.#createTemplate(parameterSetDescriptor);
    }

    createParameters() {
        let parameters = this.#templateParameterSet.copy();

        parameters.randomize();

        return parameters;
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