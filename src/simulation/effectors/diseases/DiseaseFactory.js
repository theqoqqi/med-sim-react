import {BaseEffectorFactory} from '../BaseEffectorFactory.js';
import Disease from './Disease.js';
import Random from '../../utils/Random.js';

export default class DiseaseFactory extends BaseEffectorFactory {

    createInstance(options) {
        return new Disease(options);
    }

    validateDescriptor(descriptor) {
        super.validateDescriptor(descriptor);

        BaseEffectorFactory.assertType(descriptor, 'description', 'string');
        BaseEffectorFactory.assertType(descriptor, 'chancePerDay', 'number');
        BaseEffectorFactory.assertDiseaseSources(descriptor, 'sourcePowers');
    }

    createRandom() {
        const randomDescriptor = Random.weightedByField(this.descriptors, 'chancePerDay');

        return this.createFromDescriptor(randomDescriptor);
    }

    createRandomSet() {
        return this.descriptors
            .filter(descriptor => Math.random() < descriptor.chancePerDay)
            .map(descriptor => this.createFromDescriptor(descriptor));
    }
}