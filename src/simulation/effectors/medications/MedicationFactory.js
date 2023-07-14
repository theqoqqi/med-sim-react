import {BaseEffectorFactory} from '../BaseEffectorFactory.js';
import Medication from './Medication.js';

export default class MedicationFactory extends BaseEffectorFactory {

    createInstance(descriptor, human, effects) {
        return new Medication({
            ...descriptor,
            human,
            effects,
        });
    }
}