import styles from './Center.module.css';
import React from 'react';
import classNames from 'classnames';

function Center({className, ...props}) {
    return (
        <div className={classNames(styles.center, className)} {...props} />
    );
}

export default Center;