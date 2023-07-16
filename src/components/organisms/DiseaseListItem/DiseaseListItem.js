import styles from './DiseaseListItem.module.css';
import React from 'react';
import PropTypes from 'prop-types';

DiseaseListItem.propTypes = {
    descriptor: PropTypes.object,
};

function DiseaseListItem({ descriptor }) {
    return (
        <div className={styles.diseaseListItem}>
            {descriptor.title}
        </div>
    );
}

export default DiseaseListItem;