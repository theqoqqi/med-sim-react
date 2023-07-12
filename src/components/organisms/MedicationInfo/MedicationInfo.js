import styles from './MedicationInfo.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Col, Row} from 'react-bootstrap';
import Simulation from '../../../simulation/Simulation.js';
import NumberRange from '../../../simulation/utils/NumberRange.js';
import Human from '../../../simulation/humans/Human.js';
import MedicationEffects from '../MedicationEffects/MedicationEffects.js';

MedicationInfo.propTypes = {
    descriptor: PropTypes.object,
    simulation: PropTypes.instanceOf(Simulation),
    patient: PropTypes.instanceOf(Human),
};

function MedicationInfo({ descriptor, simulation, patient }) {

    let progressPerDayRange = NumberRange.from(descriptor.progressPerDay);
    let averageProgressPerDay = progressPerDayRange.average;
    let averageDays = 1 / averageProgressPerDay;

    return (
        <div className={classNames(styles.medicationInfo)}>
            <Row>
                <Col>
                    <div>
                        {descriptor.title}
                    </div>
                    <small className='opacity-75'>
                        Действует около {averageDays.toFixed(1)} дней
                        {' '}
                        <small style={{ fontSize: 11 }}>
                            ({descriptor.impactFunction})
                        </small>
                    </small>
                </Col>
                <Col>
                    <MedicationEffects
                        simulation={simulation}
                        descriptor={descriptor}
                        patient={patient}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default MedicationInfo;