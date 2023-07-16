import styles from './HumanList.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Human from '../../../simulation/humans/Human.js';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

HumanList.propTypes = {
    humans: PropTypes.arrayOf(PropTypes.instanceOf(Human)),
};

function HumanList({ humans, selected, onSelect, listItemContent }) {
    listItemContent ??= human => human.fullName;

    return (
        <ListGroup className={styles.humanList} variant='flush'>
            {humans.map(human => (
                <ListGroupItem
                    key={human.id}
                    active={human === selected}
                    onClick={() => onSelect(human)}
                    action
                >
                    {listItemContent(human)}
                </ListGroupItem>
            ))}
        </ListGroup>
    );
}

export default HumanList;