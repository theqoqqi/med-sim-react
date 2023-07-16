import styles from './HumanList.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Human from '../../../simulation/humans/Human.js';
import List from '../../molecules/List/List.js';

let listItemContentVariants = {
    aliveHuman: human => <AliveHumanContent human={human} />,
    deadHuman: human => <DeadHumanContent human={human} />,
};

function AliveHumanContent({ human }) {
    return human.fullName;
}

function DeadHumanContent({ human }) {
    return (
        <div className='d-flex flex-column'>
            <span>{human.fullName}</span>
            <div className='d-flex justify-content-between'>
                <small>{human?.lethalParameter?.title}</small>
                <small>{human.aliveDays} день</small>
            </div>
        </div>
    );
}

HumanList.propTypes = {
    humans: PropTypes.arrayOf(PropTypes.instanceOf(Human)),
    selected: PropTypes.object,
    onSelect: PropTypes.func,
    listItemContentVariant: PropTypes.oneOf(['aliveHuman', 'deadHuman']),
};

function HumanList({ humans, selected, onSelect, listItemContentVariant }) {
    return (
        <List
            className={styles.humanList}
            items={humans}
            selected={selected}
            onSelect={onSelect}
            listItemContent={listItemContentVariants[listItemContentVariant]}
            variant='flush'
        />
    );
}

export default HumanList;