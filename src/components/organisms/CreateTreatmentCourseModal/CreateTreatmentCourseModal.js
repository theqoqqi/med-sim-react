import styles from './CreateTreatmentCourseModal.module.css';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'react-bootstrap';
import Button from '../../atoms/Button/Button.js';
import Simulation from '../../../simulation/Simulation.js';
import MedicationList from '../MedicationList/MedicationList.js';
import ScrollPane from '../../atoms/ScrollPane/ScrollPane.js';
import TreatmentCourse from '../../../simulation/TreatmentCourse.js';
import NumberControlWithPresets from '../../molecules/NumberControlWithPresets/NumberControlWithPresets.js';

CreateTreatmentCourseModal.propTypes = {
    simulation: PropTypes.instanceOf(Simulation),
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    onCreate: PropTypes.func,
};

function CreateTreatmentCourseModal({ simulation, patient, visible, onCancel, onCreate }) {
    const maxInterval = 15;
    const maxIntakes = 30;

    let intervalPresets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let intakesPresets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    let [selectedMedication, setSelectedMedication] = useState(null);
    let [interval, setInterval] = useState('');
    let [intakes, setIntakes] = useState('');
    let [isAllValid, setAllValid] = useState(false);

    useEffect(() => {
        let allValid = selectedMedication !== null
            && interval > 0
            && intakes > 0;

        setAllValid(allValid);
    }, [selectedMedication, interval, intakes]);

    let sortedMedications = [...simulation.allMedicationDescriptors].sort((a, b) => {
        let aEffectiveness = getMedicationEffectiveness(a);
        let bEffectiveness = getMedicationEffectiveness(b);

        return bEffectiveness - aEffectiveness;
    });

    function getMedicationEffectiveness(medication) {
        let parameterImpacts = simulation.flattenParameterEffectImpacts(medication.effects, getParameterEffectiveness);

        return parameterImpacts.reduce((sum, impact) => sum + impact, 0);
    }

    function getParameterEffectiveness(parameterPath, impactValue) {
        if (!patient) {
            return 0;
        }

        let parameter = patient.getParameter(parameterPath);
        let oldValue = parameter.value;
        let newValue = oldValue + impactValue;

        let oldDistance = parameter.normalRange.getDistance(oldValue);
        let newDistance = parameter.normalRange.getDistance(newValue);

        if (oldDistance < 0 || newDistance < 0) console.log(oldDistance, newDistance);
        return oldDistance - newDistance;
    }

    function onClickCreate() {
        let treatmentCourse = new TreatmentCourse({
            medicationName: selectedMedication.name,
            interval,
            totalIntakes: intakes,
        });

        onCreate(treatmentCourse);
    }

    return (
        <div className={styles.createTreatmentCourseModal}>
            <Modal show={visible} onHide={() => onCancel()} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Создать курс лечения</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.inputList}>
                    <ScrollPane className={styles.medicationListScrollPane} orientation='vertical'>
                        <MedicationList
                            descriptors={sortedMedications}
                            simulation={simulation}
                            patient={patient}
                            selected={selectedMedication}
                            onSelect={medication => setSelectedMedication(medication)}
                        />
                    </ScrollPane>
                    <NumberControlWithPresets
                        title='Каждые'
                        unitTitle='дней'
                        presets={intervalPresets}
                        value={interval}
                        minValue={1}
                        maxValue={maxInterval}
                        onInput={setInterval}
                        placeholder='другое'
                    />
                    <NumberControlWithPresets
                        title='Принять'
                        unitTitle='раз'
                        presets={intakesPresets}
                        value={intakes}
                        minValue={1}
                        maxValue={maxIntakes}
                        onInput={setIntakes}
                        placeholder='другое'
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='primary'
                        onClick={() => onClickCreate()}
                        disabled={!isAllValid}
                    >
                        Создать
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CreateTreatmentCourseModal;