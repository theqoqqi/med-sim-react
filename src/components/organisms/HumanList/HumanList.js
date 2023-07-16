import styles from './HumanList.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Human from '../../../simulation/humans/Human.js';
import List from '../../molecules/List/List.js';

HumanList.propTypes = {
    humans: PropTypes.arrayOf(PropTypes.instanceOf(Human)),
    selected: PropTypes.object,
    onSelect: PropTypes.func,
    listItemContent: PropTypes.func.isRequired,
};

function HumanList({ humans, selected, onSelect, listItemContent }) {
    return (
        <List
            className={styles.humanList}
            items={humans}
            selected={selected}
            onSelect={onSelect}
            listItemContent={listItemContent}
            variant='flush'
        />
    );
}

export default HumanList;