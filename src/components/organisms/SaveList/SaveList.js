import styles from './SaveList.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import SaveListItem from '../SaveListItem/SaveListItem.js';

SaveList.propTypes = {
    saves: PropTypes.arrayOf(PropTypes.object),
    selected: PropTypes.object,
    onSelect: PropTypes.func,
};

function SaveList({ saves, selected, onSelect }) {
    return (
        <ListGroup className={styles.saveList} variant='flush'>
            {saves.map(save => (
                <ListGroupItem
                    key={save.saveId}
                    active={save.saveId === selected?.saveId}
                    onClick={() => onSelect?.(save)}
                    action
                >
                    <SaveListItem save={save} />
                </ListGroupItem>
            ))}
        </ListGroup>
    );
}

export default SaveList;