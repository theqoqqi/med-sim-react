import {BaseEffectorFactory} from '../BaseEffectorFactory.js';
import Medication from './Medication.js';

export default class MedicationFactory extends BaseEffectorFactory {

    createInstance(options) {
        return new Medication(options);
    }
    
    validateDescriptor(descriptor) {
        super.validateDescriptor(descriptor);

        BaseEffectorFactory.assertDiseaseSources(descriptor, 'sourceEffects');
    }
}