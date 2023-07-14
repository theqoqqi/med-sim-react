import styles from './SaveListItem.module.css';
import React from 'react';
import PropTypes from 'prop-types';

SaveListItem.propTypes = {
    save: PropTypes.object,
};

function SaveListItem({ save }) {
    let savedAt = new Date(save.savedAt);

    return (
        <div className={styles.saveListItem}>
            <div>
                { save?.title }
            </div>
            <small className='d-flex justify-content-between opacity-75'>
                <span>
                    день { save.currentDay }, { save.aliveHumans } человек
                </span>
                <span>
                    { savedAt.toLocaleString() }
                </span>
            </small>
        </div>
    );
}

export default SaveListItem;