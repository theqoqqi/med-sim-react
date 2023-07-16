import styles from './DiseaseList.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import List from '../../molecules/List/List.js';
import DiseaseListItem from '../DiseaseListItem/DiseaseListItem.js';

DiseaseList.propTypes = {
    diseases: PropTypes.arrayOf(PropTypes.object),
    selected: PropTypes.object,
    onSelect: PropTypes.func,
};

function DiseaseList({ descriptors, selected, onSelect }) {
    return (
        <List
            className={styles.diseaseList}
            items={descriptors}
            selected={selected}
            onSelect={onSelect}
            variant='flush'
            listItemContent={descriptor => (
                <DiseaseListItem descriptor={descriptor} />
            )}
        />
    );
}

export default DiseaseList;