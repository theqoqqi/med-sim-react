import styles from './HumanList.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import Human from '../../../simulation/humans/Human.js';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import ScrollPane from '../../atoms/ScrollPane/ScrollPane.js';
import classNames from 'classnames';

HumanList.propTypes = {
    humans: PropTypes.arrayOf(PropTypes.instanceOf(Human)),
};

function HumanList({className, humans, selected, onSelect}) {
    return (
        <ScrollPane className={classNames(styles.scrollPane, className)} orientation='vertical'>
            <ListGroup className={styles.humanList} variant='flush'>
                {humans.map(human => (
                    <ListGroupItem
                        key={human.id}
                        active={human === selected}
                        onClick={() => onSelect(human)}
                        action
                    >
                        {human.fullName}
                    </ListGroupItem>
                ))}
            </ListGroup>
        </ScrollPane>
    );
}

export default HumanList;