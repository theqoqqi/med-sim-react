import {BaseEffectorFactory} from '../BaseEffectorFactory.js';
import Disease from './Disease.js';
import Random from '../../utils/Random.js';

export default class DiseaseFactory extends BaseEffectorFactory {

    createInstance(descriptor, human, effects) {
        return new Disease({
            ...descriptor,
            human,
            effects,
        });
    }

    createRandom(human) {
        const randomDescriptor = Random.weightedByField(this.allDescriptors, 'chancePerDay');

        return this.createFromDescriptor(human, randomDescriptor);
    }

    createRandomSet(human) {
        return this.allDescriptors
            .filter(descriptor => {
                return Math.random() < descriptor.chancePerDay;
            })
            .map(descriptor => {
                return this.createFromDescriptor(human, descriptor);
            });
    }
}