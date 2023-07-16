import styles from './MedicationList.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import MedicationInfo from '../MedicationInfo/MedicationInfo.js';
import Simulation from '../../../simulation/Simulation.js';
import Human from '../../../simulation/humans/Human.js';
import List from '../../molecules/List/List.js';

MedicationList.propTypes = {
    descriptors: PropTypes.arrayOf(PropTypes.object),
    simulation: PropTypes.instanceOf(Simulation),
    patient: PropTypes.instanceOf(Human),
    selected: PropTypes.object,
    onSelect: PropTypes.func,
};

function MedicationList({ descriptors, simulation, patient, selected, onSelect }) {

    return (
        <List
            className={styles.medicationList}
            items={descriptors}
            selected={selected}
            onSelect={onSelect}
            listItemProps={(item, index, selected) => ({
                variant: selected ? 'primary' : '',
            })}
            listItemContent={descriptor => (
                <MedicationInfo
                    descriptor={descriptor}
                    simulation={simulation}
                    patient={patient}
                />
            )}
            variant='flush'
        />
    );
}

export default MedicationList;