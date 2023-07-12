import styles from './MedicationList.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import MedicationInfo from '../MedicationInfo/MedicationInfo.js';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import Simulation from '../../../simulation/Simulation.js';
import Human from '../../../simulation/humans/Human.js';

MedicationList.propTypes = {
    descriptors: PropTypes.arrayOf(PropTypes.object),
    simulation: PropTypes.instanceOf(Simulation),
    patient: PropTypes.instanceOf(Human),
    selected: PropTypes.object,
    onSelect: PropTypes.func,
};

function MedicationList({ descriptors, simulation, patient, selected, onSelect }) {

    return (
        <ListGroup className={styles.medicationList} variant='flush'>
            {descriptors.map(descriptor => (
                <ListGroupItem
                    key={descriptor.title}
                    variant={descriptor === selected ? 'primary' : ''}
                    active={descriptor === selected}
                    onClick={() => onSelect?.(descriptor)}
                    action
                >
                    <MedicationInfo
                        descriptor={descriptor}
                        simulation={simulation}
                        patient={patient}
                    />
                </ListGroupItem>
            ))}
        </ListGroup>
    );
}

export default MedicationList;