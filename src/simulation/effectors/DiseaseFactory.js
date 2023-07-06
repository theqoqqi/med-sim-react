import ParameterEffect from '../parameters/ParameterEffect.js';
import Disease from './Disease.js';
import Easing from '../utils/Easing.js';
import NumberParameter from '../parameters/NumberParameter.js';
import CompositeParameter from '../parameters/CompositeParameter.js';
import Random from '../utils/Random.js';

export default class DiseaseFactory {

    #allDiseaseDescriptors;

    constructor(diseaseDescriptors) {
        this.#allDiseaseDescriptors = diseaseDescriptors;
    }

    createByIndex(human, index) {
        const descriptor = this.#allDiseaseDescriptors[index];

        if (!descriptor) {
            throw new Error(`Disease with index ${index} not found.`);
        }

        return this.#createFromDescriptor(human, descriptor);
    }

    createRandom(human) {
        const randomDescriptor = Random.weightedByField(this.#allDiseaseDescriptors, 'chancePerDay');

        return this.#createFromDescriptor(human, randomDescriptor);
    }

    createRandomSet(human) {
        return this.#allDiseaseDescriptors
            .filter(descriptor => {
                return Math.random() < descriptor.chancePerDay;
            })
            .map(descriptor => {
                return this.#createFromDescriptor(human, descriptor);
            });
    }

    #createFromDescriptor(human, descriptor) {
        const effects = Object.entries(descriptor.effects)
            .flatMap(([parameterName, effectDescriptor]) => {
                return this.createParameterEffects(human, parameterName, effectDescriptor);
            });

        return new Disease(descriptor, human, effects);
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