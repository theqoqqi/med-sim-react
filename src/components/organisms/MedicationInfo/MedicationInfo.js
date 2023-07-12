import styles from './MedicationInfo.module.css';
import React from 'react';
import PropTypes from 'prop-types';

MedicationInfo.propTypes = {
    descriptor: PropTypes.object,
};

function MedicationInfo({descriptor}) {
    return (
        <div className={styles.medicationInfo}>
            {descriptor.title}
        </div>
    );
}

export default MedicationInfo;