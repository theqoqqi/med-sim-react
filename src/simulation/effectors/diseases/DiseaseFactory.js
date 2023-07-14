import {BaseEffectorFactory} from '../BaseEffectorFactory.js';
import Disease from './Disease.js';
import Random from '../../utils/Random.js';

export default class DiseaseFactory extends BaseEffectorFactory {

    createInstance(options) {
        return new Disease(options);
    }

    createRandom() {
        const randomDescriptor = Random.weightedByField(this.allDescriptors, 'chancePerDay');

        return this.createFromDescriptor(randomDescriptor);
    }

    createRandomSet() {
        return this.allDescriptors
            .filter(descriptor => Math.random() < descriptor.chancePerDay)
            .map(descriptor => this.createFromDescriptor(descriptor));
    }
}