import styles from './SaveList.module.css';
import React from 'react';
import PropTypes from 'prop-types';
import SaveListItem from '../SaveListItem/SaveListItem.js';
import List from '../../molecules/List/List.js';

SaveList.propTypes = {
    saves: PropTypes.arrayOf(PropTypes.object),
    selected: PropTypes.object,
    onSelect: PropTypes.func,
};

function SaveList({ saves, selected, onSelect }) {
    return (
        <List
            className={styles.saveList}
            items={saves}
            selected={selected}
            onSelect={onSelect}
            variant='flush'
            listItemContent={save => (
                <SaveListItem save={save} />
            )}
        />
    );
}

export default SaveList;