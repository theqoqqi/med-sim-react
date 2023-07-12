import styles from './CreateTreatmentCourseModal.module.css';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Form, InputGroup, Modal} from 'react-bootstrap';
import Button from '../../atoms/Button/Button.js';
import Simulation from '../../../simulation/Simulation.js';
import classNames from 'classnames';
import MedicationList from '../MedicationList/MedicationList.js';
import ScrollPane from '../../atoms/ScrollPane/ScrollPane.js';
import TreatmentCourse from '../../../simulation/TreatmentCourse.js';

CreateTreatmentCourseModal.propTypes = {
    simulation: PropTypes.instanceOf(Simulation),
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    onCreate: PropTypes.func,
};

function NumberControlWithPresets({
                                      className, title, unitTitle, presets,
                                      value, minValue, maxValue, onInput, placeholder
                                  }) {

    return (
        <InputGroup className={className}>
            <InputGroup.Text>
                {title}
            </InputGroup.Text>
            {presets.map(presetValue => (
                <Button
                    key={presetValue}
                    className={classNames('border', {
                        active: presetValue === +value,
                    })}
                    variant={presetValue === +value ? 'primary' : 'light'}
                    onClick={() => onInput(presetValue)}
                >
                    {presetValue}
                </Button>
            ))}
            <Form.Control
                className='text-center'
                type='number'
                value={value}
                onInput={e => onInput(e.target.value)}
                min={minValue}
                max={maxValue}
                placeholder={placeholder}
            />
            <InputGroup.Text>
                {unitTitle}
            </InputGroup.Text>
        </InputGroup>
    );
}

function CreateTreatmentCourseModal({ simulation, patient, visible, onCancel, onCreate }) {
    const maxInterval = 15;
    const maxTimes = 30;

    let intervalPresets = [1, 2, 3, 5, 7, 10];
    let timesPresets = [1, 2, 3, 5, 7, 10];

    let [selectedMedication, setSelectedMedication] = useState(null);
    let [interval, setInterval] = useState('');
    let [times, setTimes] = useState('');

    function onClickCreate() {
        let treatmentCourse = new TreatmentCourse(
            patient,
            selectedMedication,
            interval,
            times
        );

        onCreate(treatmentCourse);
    }

    return (
        <div className={styles.createTreatmentCourseModal}>
            <Modal show={visible} onHide={() => onCancel()}>
                <Modal.Header closeButton>
                    <Modal.Title>Создать курс лечения</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.inputList}>
                    <ScrollPane className={styles.medicationListScrollPane} orientation='vertical'>
                        <MedicationList
                            descriptors={simulation.allMedicationDescriptors}
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
                        presets={timesPresets}
                        value={times}
                        minValue={1}
                        maxValue={maxTimes}
                        onInput={setTimes}
                        placeholder='другое'
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='primary' onClick={() => onClickCreate()}>
                        Создать
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CreateTreatmentCourseModal;