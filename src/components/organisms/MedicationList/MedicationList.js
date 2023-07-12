import styles from './MedicationList.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import MedicationInfo from '../MedicationInfo/MedicationInfo.js';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import Simulation from '../../../simulation/Simulation.js';

MedicationList.propTypes = {
    descriptors: PropTypes.arrayOf(PropTypes.object),
    simulation: PropTypes.instanceOf(Simulation),
};

function MedicationList({descriptors, simulation, selected, onSelect}) {

    return (
        <ListGroup className={styles.medicationList} variant='flush'>
            {descriptors.map(descriptor => (
                <ListGroupItem
                    key={descriptor.title}
                    active={descriptor === selected}
                    onClick={() => onSelect?.(descriptor)}
                    action
                >
                    <MedicationInfo descriptor={descriptor} simulation={simulation} />
                </ListGroupItem>
            ))}
        </ListGroup>
    );
}

export default MedicationList;